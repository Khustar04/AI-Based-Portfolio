import { createContext, useContext, useState, useEffect, useRef } from "react";
import { personalInfo as defaultPersonalInfo } from "../data/personalInfo";
import { projects as defaultProjects } from "../data/projects";
import { skills as defaultSkills } from "../data/skills";
import { certifications as defaultCertifications } from "../data/certifications";
import { education as defaultEducation } from "../data/education";
import { socialLinks as defaultSocialLinks } from "../data/socialLinks";
import {
  fetchCloudPortfolio,
  saveCloudPortfolio,
  getSupabaseCredentials,
  uploadImageToSupabase,
  uploadResumeToSupabase,
  testAndSyncSupabase,
  getSupabase,
} from "../utils/supabaseClient";

const PortfolioDataContext = createContext(null);

const STORAGE_KEYS = {
  PERSONAL_INFO: "portfolio_personal_info_v1",
  PROJECTS: "portfolio_projects_v1",
  SKILLS: "portfolio_skills_v1",
  CERTIFICATIONS: "portfolio_certifications_v1",
  EDUCATION: "portfolio_education_v1",
  SOCIAL_LINKS: "portfolio_social_links_v1",
  ADMIN_PIN: "portfolio_admin_pin_v1",
  ADMIN_AUTH: "portfolio_admin_auth_v1",
};

const DEFAULT_ADMIN_PIN = "admin123";

function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    if (parsed === null || parsed === undefined) return defaultValue;
    return parsed;
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export function PortfolioDataProvider({ children }) {
  const [personalInfo, setPersonalInfoState] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.PERSONAL_INFO, defaultPersonalInfo);
    return {
      ...defaultPersonalInfo,
      ...stored,
      titles: Array.isArray(stored?.titles)
        ? stored.titles
        : defaultPersonalInfo.titles,
    };
  });

  const [projects, setProjectsState] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.PROJECTS, defaultProjects);
    if (!Array.isArray(stored)) return defaultProjects;
    return stored.map((p) => ({
      ...p,
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      features: Array.isArray(p.features) ? p.features : [],
    }));
  });

  const [skills, setSkillsState] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.SKILLS, defaultSkills);
    if (!Array.isArray(stored)) return defaultSkills;
    return stored.map((s) => ({
      ...s,
      items: Array.isArray(s.items) ? s.items : [],
    }));
  });

  const [certifications, setCertificationsState] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.CERTIFICATIONS, defaultCertifications);
    if (!Array.isArray(stored)) return defaultCertifications;
    return stored.map((c) => ({
      ...c,
      skillsLearned: Array.isArray(c.skillsLearned) ? c.skillsLearned : [],
    }));
  });

  const [education, setEducationState] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.EDUCATION, defaultEducation);
    if (!Array.isArray(stored)) return defaultEducation;
    return stored.map((e) => ({
      ...e,
      coursework: Array.isArray(e.coursework) ? e.coursework : [],
      highlights: Array.isArray(e.highlights) ? e.highlights : [],
    }));
  });

  const [socialLinks, setSocialLinksState] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.SOCIAL_LINKS, defaultSocialLinks);
    if (!Array.isArray(stored)) return defaultSocialLinks;
    return stored;
  });

  const [adminPin, setAdminPinState] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN)
  );

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() =>
    Boolean(loadFromStorage(STORAGE_KEYS.ADMIN_AUTH, false))
  );

  const [cloudStatus, setCloudStatus] = useState(() => getSupabaseCredentials());
  const initialCloudLoadedRef = useRef(false);

  // Helper to apply incoming cloud/broadcast payload to state
  const applyPayloadToState = (cloudData) => {
    if (!cloudData) return;
    if (cloudData.personalInfo) setPersonalInfoState(cloudData.personalInfo);
    if (Array.isArray(cloudData.projects)) setProjectsState(cloudData.projects);
    if (Array.isArray(cloudData.skills)) setSkillsState(cloudData.skills);
    if (Array.isArray(cloudData.certifications)) setCertificationsState(cloudData.certifications);
    if (Array.isArray(cloudData.education)) setEducationState(cloudData.education);
    if (Array.isArray(cloudData.socialLinks)) setSocialLinksState(cloudData.socialLinks);
  };

  // 1. Supabase Realtime WebSocket Subscription (Broadcast + Postgres changes)
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const channel = supabase.channel("portfolio_live_channel");

      channel
        .on("broadcast", { event: "portfolio_state_update" }, (msg) => {
          if (msg?.payload) {
            applyPayloadToState(msg.payload);
          }
        })
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "portfolio_data",
            filter: "id=eq.main_portfolio",
          },
          (payload) => {
            if (payload?.new?.payload) {
              applyPayloadToState(payload.new.payload);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn("Realtime subscription note:", err);
    }
  }, [cloudStatus?.isConfigured]);

  // 2. Continuous Background Heartbeat & Focus Sync (Guarantees zero-refresh updates)
  useEffect(() => {
    const syncWithCloud = async () => {
      try {
        const cloudData = await fetchCloudPortfolio();
        if (cloudData) {
          applyPayloadToState(cloudData);
        }
      } catch (err) {
        // Silently ignore network hiccup in background
      }
    };

    // Initial sync
    syncWithCloud();

    // Auto-sync whenever visitor returns to or focuses the tab
    const handleVisibility = () => {
      if (!document.hidden) syncWithCloud();
    };
    const handleFocus = () => syncWithCloud();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    // 4-second background heartbeat poller
    const pollInterval = setInterval(() => {
      if (!document.hidden) {
        syncWithCloud();
      }
    }, 4000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
      clearInterval(pollInterval);
    };
  }, [cloudStatus?.isConfigured]);

  // 2. Local multi-tab real-time listener (updates other tabs on same device immediately)
  useEffect(() => {
    let bc = null;
    try {
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        bc = new BroadcastChannel("portfolio_state_broadcast");
        bc.onmessage = (event) => {
          if (event.data) {
            const { personalInfo, projects, skills, certifications, education, socialLinks } = event.data;
            if (personalInfo) setPersonalInfoState(personalInfo);
            if (projects) setProjectsState(projects);
            if (skills) setSkillsState(skills);
            if (certifications) setCertificationsState(certifications);
            if (education) setEducationState(education);
            if (socialLinks) setSocialLinksState(socialLinks);
          }
        };
      }
    } catch {
      // Fallback
    }

    const handleStorage = (e) => {
      try {
        if (!e.newValue) return;
        const parsed = JSON.parse(e.newValue);
        if (e.key === STORAGE_KEYS.PERSONAL_INFO) setPersonalInfoState(parsed);
        if (e.key === STORAGE_KEYS.PROJECTS) setProjectsState(parsed);
        if (e.key === STORAGE_KEYS.SKILLS) setSkillsState(parsed);
        if (e.key === STORAGE_KEYS.CERTIFICATIONS) setCertificationsState(parsed);
        if (e.key === STORAGE_KEYS.EDUCATION) setEducationState(parsed);
        if (e.key === STORAGE_KEYS.SOCIAL_LINKS) setSocialLinksState(parsed);
      } catch {
        // Ignore JSON errors
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Save and test credentials helper for Admin Panel
  const connectAndSyncCloud = async (url, key) => {
    const currentPayload = {
      personalInfo,
      projects,
      skills,
      certifications,
      education,
      socialLinks,
    };
    const res = await testAndSyncSupabase(url, key, currentPayload);
    setCloudStatus(getSupabaseCredentials());
    return res;
  };

  const syncNowToCloud = async () => {
    const currentPayload = {
      personalInfo,
      projects,
      skills,
      certifications,
      education,
      socialLinks,
    };
    return await saveCloudPortfolio(currentPayload);
  };

  // Upload image helper with cloud priority
  const uploadImageFile = async (file, folder = "photos") => {
    try {
      const cloudUrl = await uploadImageToSupabase(file, folder);
      if (cloudUrl) return cloudUrl;
    } catch (err) {
      console.warn("Supabase upload failed, falling back to local:", err.message);
    }
    return null;
  };

  // Upload resume helper (replaces old file in DB and updates personalInfo.resumeUrl)
  const uploadResumeFile = async (file) => {
    try {
      const cloudUrl = await uploadResumeToSupabase(file);
      if (cloudUrl) {
        updatePersonalInfo({ resumeUrl: cloudUrl });
        return {
          success: true,
          url: cloudUrl,
          message: "Resume PDF uploaded to Cloud Storage and updated live across the portfolio!",
        };
      }
    } catch (err) {
      console.warn("Cloud resume upload note:", err.message);
    }

    // Fallback for local testing
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const localDataUri = e.target.result;
        updatePersonalInfo({ resumeUrl: localDataUri });
        resolve({
          success: true,
          url: localDataUri,
          message: "Resume updated locally! (Connect Supabase in Settings for global cloud hosting)",
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Sync to local storage & push to cloud in background
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PERSONAL_INFO, personalInfo);
  }, [personalInfo]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SKILLS, skills);
  }, [skills]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CERTIFICATIONS, certifications);
  }, [certifications]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EDUCATION, education);
  }, [education]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, socialLinks);
  }, [socialLinks]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ADMIN_PIN, adminPin);
  }, [adminPin]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ADMIN_AUTH, isAdminAuthenticated);
  }, [isAdminAuthenticated]);

  // Debounced cloud background sync & local multi-tab broadcast
  useEffect(() => {
    // 1. Instant local multi-tab broadcast
    try {
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        const bc = new BroadcastChannel("portfolio_state_broadcast");
        bc.postMessage({
          personalInfo,
          projects,
          skills,
          certifications,
          education,
          socialLinks,
        });
        bc.close();
      }
    } catch {
      // Ignore
    }

    // 2. Cloud DB push and global WebSocket broadcast
    const timer = setTimeout(() => {
      saveCloudPortfolio({
        personalInfo,
        projects,
        skills,
        certifications,
        education,
        socialLinks,
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [personalInfo, projects, skills, certifications, education, socialLinks]);

  // Auth methods
  const loginAdmin = (enteredPin) => {
    if (enteredPin.trim() === adminPin.trim()) {
      setIsAdminAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: "Invalid PIN code. Please try again." };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
  };

  const changeAdminPin = (newPin) => {
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, message: "PIN must be at least 4 characters long." };
    }
    setAdminPinState(newPin.trim());
    return { success: true, message: "Admin PIN updated successfully!" };
  };

  // Personal Info
  const updatePersonalInfo = (updatedFields) => {
    setPersonalInfoState((prev) => {
      let firstName = prev.firstName;
      let lastName = prev.lastName;
      let initials = prev.initials;
      if (updatedFields.name) {
        const parts = updatedFields.name.trim().split(/\s+/);
        firstName = parts[0] || prev.firstName;
        lastName = parts.slice(1).join(" ") || prev.lastName;
        initials = ((parts[0] ? parts[0][0] : "K") + (parts[1] ? parts[1][0] : "")).toUpperCase();
      }
      return {
        ...prev,
        ...updatedFields,
        firstName: updatedFields.firstName || firstName,
        lastName: updatedFields.lastName || lastName,
        initials: updatedFields.initials || initials,
        titles: Array.isArray(updatedFields.titles)
          ? updatedFields.titles
          : prev.titles,
      };
    });
  };

  // Projects CRUD
  const addProject = (newProject) => {
    const slug =
      newProject.slug ||
      newProject.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const projectWithId = {
      ...newProject,
      id: newProject.id || slug || `project-${Date.now()}`,
      slug,
      status: newProject.status || "featured",
      technologies: Array.isArray(newProject.technologies)
        ? newProject.technologies
        : [],
      features: Array.isArray(newProject.features) ? newProject.features : [],
    };

    setProjectsState((prev) => [projectWithId, ...prev]);
    return projectWithId;
  };

  const updateProject = (id, updatedProject) => {
    setProjectsState((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updatedProject,
              technologies: Array.isArray(updatedProject.technologies)
                ? updatedProject.technologies
                : p.technologies || [],
              features: Array.isArray(updatedProject.features)
                ? updatedProject.features
                : p.features || [],
            }
          : p
      )
    );
  };

  const deleteProject = (id) => {
    setProjectsState((prev) => prev.filter((p) => p.id !== id));
  };

  // Skills CRUD
  const addSkillCategory = (newCategory) => {
    const categoryWithId = {
      ...newCategory,
      id: newCategory.id || `skill-${Date.now()}`,
      icon: newCategory.icon || "Code2",
      items: Array.isArray(newCategory.items) ? newCategory.items : [],
    };
    setSkillsState((prev) => [...prev, categoryWithId]);
  };

  const updateSkillCategory = (id, updatedCategory) => {
    setSkillsState((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...updatedCategory,
              items: Array.isArray(updatedCategory.items)
                ? updatedCategory.items
                : s.items || [],
            }
          : s
      )
    );
  };

  const deleteSkillCategory = (id) => {
    setSkillsState((prev) => prev.filter((s) => s.id !== id));
  };

  // Certifications CRUD
  const addCertification = (newCert) => {
    const slug =
      newCert.slug ||
      newCert.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const certWithId = {
      ...newCert,
      id: newCert.id || slug || `cert-${Date.now()}`,
      slug,
      skillsLearned: Array.isArray(newCert.skillsLearned)
        ? newCert.skillsLearned
        : [],
    };
    setCertificationsState((prev) => [...prev, certWithId]);
    return certWithId;
  };

  const updateCertification = (id, updatedCert) => {
    setCertificationsState((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updatedCert,
              skillsLearned: Array.isArray(updatedCert.skillsLearned)
                ? updatedCert.skillsLearned
                : c.skillsLearned || [],
            }
          : c
      )
    );
  };

  const deleteCertification = (id) => {
    setCertificationsState((prev) => prev.filter((c) => c.id !== id));
  };

  // Education CRUD
  const addEducation = (newEdu) => {
    const eduWithId = {
      ...newEdu,
      id: newEdu.id || `edu-${Date.now()}`,
      coursework: Array.isArray(newEdu.coursework) ? newEdu.coursework : [],
      highlights: Array.isArray(newEdu.highlights) ? newEdu.highlights : [],
    };
    setEducationState((prev) => [...prev, eduWithId]);
  };

  const updateEducation = (id, updatedEdu) => {
    setEducationState((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              ...updatedEdu,
              coursework: Array.isArray(updatedEdu.coursework)
                ? updatedEdu.coursework
                : e.coursework || [],
              highlights: Array.isArray(updatedEdu.highlights)
                ? updatedEdu.highlights
                : e.highlights || [],
            }
          : e
      )
    );
  };

  const deleteEducation = (id) => {
    setEducationState((prev) => prev.filter((e) => e.id !== id));
  };

  // Social Links CRUD
  const addSocialLink = (newSocial) => {
    const socialWithId = {
      ...newSocial,
      id: newSocial.id || `social-${Date.now()}`,
    };
    setSocialLinksState((prev) => [...prev, socialWithId]);
  };

  const updateSocialLink = (id, updatedSocial) => {
    setSocialLinksState((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedSocial } : s))
    );
  };

  const deleteSocialLink = (id) => {
    setSocialLinksState((prev) => prev.filter((s) => s.id !== id));
  };

  // Reset to original defaults
  const resetToDefaults = () => {
    setPersonalInfoState(defaultPersonalInfo);
    setProjectsState(defaultProjects);
    setSkillsState(defaultSkills);
    setCertificationsState(defaultCertifications);
    setEducationState(defaultEducation);
    setSocialLinksState(defaultSocialLinks);
    setAdminPinState(DEFAULT_ADMIN_PIN);

    Object.values(STORAGE_KEYS).forEach((k) => {
      localStorage.removeItem(k);
    });
  };

  // Export & Import
  const exportDataJSON = () => {
    const fullData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      personalInfo,
      projects,
      skills,
      certifications,
      education,
      socialLinks,
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString) => {
    try {
      const data = typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
      if (data.personalInfo) setPersonalInfoState(data.personalInfo);
      if (Array.isArray(data.projects)) setProjectsState(data.projects);
      if (Array.isArray(data.skills)) setSkillsState(data.skills);
      if (Array.isArray(data.certifications)) setCertificationsState(data.certifications);
      if (Array.isArray(data.education)) setEducationState(data.education);
      if (Array.isArray(data.socialLinks)) setSocialLinksState(data.socialLinks);
      return { success: true, message: "Portfolio data successfully imported!" };
    } catch (err) {
      return { success: false, message: "Invalid JSON format: " + err.message };
    }
  };

  return (
    <PortfolioDataContext.Provider
      value={{
        // Data
        personalInfo,
        projects,
        skills,
        certifications,
        education,
        socialLinks,
        adminPin,
        isAdminAuthenticated,

        // Auth
        loginAdmin,
        logoutAdmin,
        changeAdminPin,

        // Mutators
        updatePersonalInfo,
        addProject,
        updateProject,
        deleteProject,
        addSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        addCertification,
        updateCertification,
        deleteCertification,
        addEducation,
        updateEducation,
        deleteEducation,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,

        // Cloud & Image / Resume Storage
        cloudStatus,
        connectAndSyncCloud,
        syncNowToCloud,
        uploadImageFile,
        uploadResumeFile,

        // Utilities
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error("usePortfolioData must be used within a PortfolioDataProvider");
  }
  return context;
}
