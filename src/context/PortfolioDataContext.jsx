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
  LAST_UPDATED: "portfolio_last_updated_v1",
};

const DEFAULT_ADMIN_PIN = "admin123";

let appBroadcastChannel = null;
if (typeof window !== "undefined" && window.BroadcastChannel) {
  try {
    appBroadcastChannel = new BroadcastChannel("portfolio_state_broadcast");
  } catch (err) {
    console.warn("BroadcastChannel not supported:", err);
  }
}

function broadcastLocalChange(payload, timestamp) {
  if (appBroadcastChannel) {
    try {
      appBroadcastChannel.postMessage({
        type: "PORTFOLIO_UPDATE",
        payload,
        timestamp,
      });
    } catch {
      // ignore
    }
  }
}

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
  const isIncomingSyncRef = useRef(false);
  const isInitialMountRef = useRef(true);

  // Helper to apply incoming cloud/broadcast payload to state without triggering save loop
  const applyPayloadToState = (cloudData, updatedAt = null) => {
    if (!cloudData) return;
    isIncomingSyncRef.current = true;
    if (cloudData.personalInfo) {
      setPersonalInfoState(cloudData.personalInfo);
      saveToStorage(STORAGE_KEYS.PERSONAL_INFO, cloudData.personalInfo);
    }
    if (Array.isArray(cloudData.projects)) {
      setProjectsState(cloudData.projects);
      saveToStorage(STORAGE_KEYS.PROJECTS, cloudData.projects);
    }
    if (Array.isArray(cloudData.skills)) {
      setSkillsState(cloudData.skills);
      saveToStorage(STORAGE_KEYS.SKILLS, cloudData.skills);
    }
    if (Array.isArray(cloudData.certifications)) {
      setCertificationsState(cloudData.certifications);
      saveToStorage(STORAGE_KEYS.CERTIFICATIONS, cloudData.certifications);
    }
    if (Array.isArray(cloudData.education)) {
      setEducationState(cloudData.education);
      saveToStorage(STORAGE_KEYS.EDUCATION, cloudData.education);
    }
    if (Array.isArray(cloudData.socialLinks)) {
      setSocialLinksState(cloudData.socialLinks);
      saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, cloudData.socialLinks);
    }
    if (updatedAt) {
      saveToStorage(STORAGE_KEYS.LAST_UPDATED, updatedAt);
    }
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
            applyPayloadToState(msg.payload, msg.payload?._updatedAt);
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
              applyPayloadToState(payload.new.payload, payload.new.updated_at);
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

  // 2. Tab Focus & Visibility Cloud Hydration with Timestamp Conflict Protection
  useEffect(() => {
    const syncWithCloud = async () => {
      try {
        const cloudRes = await fetchCloudPortfolio();
        if (!cloudRes) return;

        const cloudPayload = cloudRes.payload || cloudRes;
        const cloudUpdatedAt = cloudRes.updatedAt || cloudPayload?._updatedAt;
        const localUpdatedAt = loadFromStorage(STORAGE_KEYS.LAST_UPDATED, null);

        // Prevent race condition: if local changes are newer, do NOT overwrite with old cloud snapshot
        if (localUpdatedAt && cloudUpdatedAt) {
          const localTime = new Date(localUpdatedAt).getTime();
          const cloudTime = new Date(cloudUpdatedAt).getTime();

          if (localTime > cloudTime + 800) {
            const currentSnapshot = {
              personalInfo,
              projects,
              skills,
              certifications,
              education,
              socialLinks,
            };
            saveCloudPortfolio(currentSnapshot, null, localUpdatedAt);
            return;
          }
        }

        applyPayloadToState(cloudPayload, cloudUpdatedAt);
      } catch {
        // Silently ignore network hiccup
      }
    };

    // Initial sync on mount
    if (!initialCloudLoadedRef.current) {
      initialCloudLoadedRef.current = true;
      syncWithCloud();
    }

    // Auto-sync whenever visitor returns to or focuses the tab
    const handleVisibility = () => {
      if (!document.hidden) syncWithCloud();
    };
    const handleFocus = () => syncWithCloud();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [cloudStatus?.isConfigured]);

  // 3. Local multi-tab real-time listener (updates other tabs on same device immediately)
  useEffect(() => {
    const handleBroadcast = (event) => {
      if (event.data?.payload) {
        applyPayloadToState(event.data.payload, event.data.timestamp);
      }
    };

    if (appBroadcastChannel) {
      appBroadcastChannel.addEventListener("message", handleBroadcast);
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
      if (appBroadcastChannel) {
        appBroadcastChannel.removeEventListener("message", handleBroadcast);
      }
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

  // Upload resume helper (replaces old file in DB and updates personalInfo.resumeUrl & resumeFileName)
  const uploadResumeFile = async (file) => {
    const fileName = file?.name || "Khustar_Hussain_Resume.pdf";
    try {
      const cloudUrl = await uploadResumeToSupabase(file);
      if (cloudUrl) {
        updatePersonalInfo({ resumeUrl: cloudUrl, resumeFileName: fileName });
        return {
          success: true,
          url: cloudUrl,
          fileName,
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
        updatePersonalInfo({ resumeUrl: localDataUri, resumeFileName: fileName });
        resolve({
          success: true,
          url: localDataUri,
          fileName,
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

  // Debounced cloud background sync
  useEffect(() => {
    // Skip saving on initial render or when applying incoming sync
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    if (isIncomingSyncRef.current) {
      isIncomingSyncRef.current = false;
      return;
    }

    // Cloud DB push and global WebSocket broadcast
    const timer = setTimeout(() => {
      saveCloudPortfolio({
        personalInfo,
        projects,
        skills,
        certifications,
        education,
        socialLinks,
      });
    }, 400);
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

  // Instant multi-destination commit helper (synchronous storage, broadcast across tabs, and cloud DB push)
  const commitChange = async (partialUpdates) => {
    const nowIso = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.LAST_UPDATED, nowIso);

    // 1. Broadcast immediately across open tabs on this browser
    broadcastLocalChange(partialUpdates, nowIso);

    // 2. Push to Supabase Cloud immediately
    const fullSnapshot = {
      personalInfo: partialUpdates.personalInfo !== undefined ? partialUpdates.personalInfo : personalInfo,
      projects: partialUpdates.projects !== undefined ? partialUpdates.projects : projects,
      skills: partialUpdates.skills !== undefined ? partialUpdates.skills : skills,
      certifications: partialUpdates.certifications !== undefined ? partialUpdates.certifications : certifications,
      education: partialUpdates.education !== undefined ? partialUpdates.education : education,
      socialLinks: partialUpdates.socialLinks !== undefined ? partialUpdates.socialLinks : socialLinks,
    };

    return await saveCloudPortfolio(fullSnapshot, null, nowIso);
  };

  // Personal Info
  const updatePersonalInfo = async (updatedFields) => {
    let nextPersonalInfo = null;
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
      nextPersonalInfo = {
        ...prev,
        ...updatedFields,
        firstName: updatedFields.firstName || firstName,
        lastName: updatedFields.lastName || lastName,
        initials: updatedFields.initials || initials,
        titles: Array.isArray(updatedFields.titles)
          ? updatedFields.titles
          : prev.titles,
      };
      saveToStorage(STORAGE_KEYS.PERSONAL_INFO, nextPersonalInfo);
      return nextPersonalInfo;
    });

    if (nextPersonalInfo) {
      await commitChange({ personalInfo: nextPersonalInfo });
    }
  };

  // Projects CRUD
  const addProject = async (newProject) => {
    const slug =
      (newProject.slug || newProject.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `project-${Date.now()}`;

    const projectWithId = {
      ...newProject,
      id: newProject.id || slug,
      slug,
      status: newProject.status || "featured",
      technologies: Array.isArray(newProject.technologies)
        ? newProject.technologies
        : [],
      features: Array.isArray(newProject.features) ? newProject.features : [],
    };

    const nextProjects = [
      projectWithId,
      ...projects.filter(
        (p) =>
          String(p.id).trim() !== String(projectWithId.id).trim() &&
          (!p.slug || p.slug.trim().toLowerCase() !== projectWithId.slug.toLowerCase())
      ),
    ];

    setProjectsState(nextProjects);
    saveToStorage(STORAGE_KEYS.PROJECTS, nextProjects);
    await commitChange({ projects: nextProjects });
    return projectWithId;
  };

  const updateProject = async (id, updatedProject) => {
    const targetId = String(id || "").trim();
    const nextProjects = projects.map((p) => {
      const isMatch =
        String(p.id).trim() === targetId ||
        (p.slug && p.slug.trim().toLowerCase() === targetId.toLowerCase());

      if (!isMatch) return p;

      return {
        ...p,
        ...updatedProject,
        id: p.id,
        slug: updatedProject.slug || p.slug || targetId,
        technologies: Array.isArray(updatedProject.technologies)
          ? updatedProject.technologies
          : p.technologies || [],
        features: Array.isArray(updatedProject.features)
          ? updatedProject.features
          : p.features || [],
      };
    });

    setProjectsState(nextProjects);
    saveToStorage(STORAGE_KEYS.PROJECTS, nextProjects);
    await commitChange({ projects: nextProjects });
    return nextProjects;
  };

  const deleteProject = async (id) => {
    const targetId = String(id || "").trim();
    const nextProjects = projects.filter(
      (p) =>
        String(p.id).trim() !== targetId &&
        (!p.slug || p.slug.trim().toLowerCase() !== targetId.toLowerCase())
    );

    setProjectsState(nextProjects);
    saveToStorage(STORAGE_KEYS.PROJECTS, nextProjects);
    await commitChange({ projects: nextProjects });
    return nextProjects;
  };

  // Skills CRUD
  const addSkillCategory = async (newCategory) => {
    const categoryWithId = {
      ...newCategory,
      id: newCategory.id || `skill-${Date.now()}`,
      icon: newCategory.icon || "Code2",
      items: Array.isArray(newCategory.items) ? newCategory.items : [],
    };
    const nextSkills = [...skills, categoryWithId];
    setSkillsState(nextSkills);
    saveToStorage(STORAGE_KEYS.SKILLS, nextSkills);
    await commitChange({ skills: nextSkills });
    return categoryWithId;
  };

  const updateSkillCategory = async (id, updatedCategory) => {
    const targetId = String(id || "").trim();
    const nextSkills = skills.map((s) =>
      String(s.id).trim() === targetId
        ? {
            ...s,
            ...updatedCategory,
            items: Array.isArray(updatedCategory.items)
              ? updatedCategory.items
              : s.items || [],
          }
        : s
    );
    setSkillsState(nextSkills);
    saveToStorage(STORAGE_KEYS.SKILLS, nextSkills);
    await commitChange({ skills: nextSkills });
    return nextSkills;
  };

  const deleteSkillCategory = async (id) => {
    const targetId = String(id || "").trim();
    const nextSkills = skills.filter((s) => String(s.id).trim() !== targetId);
    setSkillsState(nextSkills);
    saveToStorage(STORAGE_KEYS.SKILLS, nextSkills);
    await commitChange({ skills: nextSkills });
    return nextSkills;
  };

  // Certifications CRUD
  const addCertification = async (newCert) => {
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
    const nextCerts = [...certifications, certWithId];
    setCertificationsState(nextCerts);
    saveToStorage(STORAGE_KEYS.CERTIFICATIONS, nextCerts);
    await commitChange({ certifications: nextCerts });
    return certWithId;
  };

  const updateCertification = async (id, updatedCert) => {
    const targetId = String(id || "").trim();
    const nextCerts = certifications.map((c) =>
      String(c.id).trim() === targetId
        ? {
            ...c,
            ...updatedCert,
            skillsLearned: Array.isArray(updatedCert.skillsLearned)
              ? updatedCert.skillsLearned
              : c.skillsLearned || [],
          }
        : c
    );
    setCertificationsState(nextCerts);
    saveToStorage(STORAGE_KEYS.CERTIFICATIONS, nextCerts);
    await commitChange({ certifications: nextCerts });
    return nextCerts;
  };

  const deleteCertification = async (id) => {
    const targetId = String(id || "").trim();
    const nextCerts = certifications.filter((c) => String(c.id).trim() !== targetId);
    setCertificationsState(nextCerts);
    saveToStorage(STORAGE_KEYS.CERTIFICATIONS, nextCerts);
    await commitChange({ certifications: nextCerts });
    return nextCerts;
  };

  // Education CRUD
  const addEducation = async (newEdu) => {
    const eduWithId = {
      ...newEdu,
      id: newEdu.id || `edu-${Date.now()}`,
      coursework: Array.isArray(newEdu.coursework) ? newEdu.coursework : [],
      highlights: Array.isArray(newEdu.highlights) ? newEdu.highlights : [],
    };
    const nextEdu = [...education, eduWithId];
    setEducationState(nextEdu);
    saveToStorage(STORAGE_KEYS.EDUCATION, nextEdu);
    await commitChange({ education: nextEdu });
    return eduWithId;
  };

  const updateEducation = async (id, updatedEdu) => {
    const targetId = String(id || "").trim();
    const nextEdu = education.map((e) =>
      String(e.id).trim() === targetId
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
    );
    setEducationState(nextEdu);
    saveToStorage(STORAGE_KEYS.EDUCATION, nextEdu);
    await commitChange({ education: nextEdu });
    return nextEdu;
  };

  const deleteEducation = async (id) => {
    const targetId = String(id || "").trim();
    const nextEdu = education.filter((e) => String(e.id).trim() !== targetId);
    setEducationState(nextEdu);
    saveToStorage(STORAGE_KEYS.EDUCATION, nextEdu);
    await commitChange({ education: nextEdu });
    return nextEdu;
  };

  // Social Links CRUD
  const addSocialLink = async (newSocial) => {
    const socialWithId = {
      ...newSocial,
      id: newSocial.id || `social-${Date.now()}`,
      platform: newSocial.platform || newSocial.name || "Link",
      url: newSocial.url || "",
      username: newSocial.username !== undefined ? newSocial.username : (newSocial.handle || ""),
      icon: newSocial.icon || newSocial.iconName || "globe",
      iconName: newSocial.iconName || newSocial.icon || "globe",
    };
    const nextSocials = [...socialLinks, socialWithId];
    setSocialLinksState(nextSocials);
    saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, nextSocials);
    await commitChange({ socialLinks: nextSocials });
    return socialWithId;
  };

  const updateSocialLink = async (id, updatedSocial) => {
    const targetId = String(id || "").trim();
    const nextSocials = socialLinks.map((s) => {
      if (String(s.id).trim() === targetId) {
        return {
          ...s,
          ...updatedSocial,
          id: s.id,
          platform: updatedSocial.platform || updatedSocial.name || s.platform || "Link",
          url: updatedSocial.url || s.url || "",
          username: updatedSocial.username !== undefined ? updatedSocial.username : (s.username || ""),
          icon: updatedSocial.icon || updatedSocial.iconName || s.icon || "globe",
          iconName: updatedSocial.iconName || updatedSocial.icon || s.iconName || "globe",
        };
      }
      return s;
    });
    setSocialLinksState(nextSocials);
    saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, nextSocials);
    await commitChange({ socialLinks: nextSocials });
    return nextSocials;
  };

  const deleteSocialLink = async (id) => {
    const targetId = String(id || "").trim();
    const nextSocials = socialLinks.filter((s) => String(s.id).trim() !== targetId);
    setSocialLinksState(nextSocials);
    saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, nextSocials);
    await commitChange({ socialLinks: nextSocials });
    return nextSocials;
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
