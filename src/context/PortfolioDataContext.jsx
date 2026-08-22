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

  // Hydrate from Supabase Cloud on initial load (so all devices see latest data)
  useEffect(() => {
    async function hydrateFromCloud() {
      if (initialCloudLoadedRef.current) return;
      initialCloudLoadedRef.current = true;

      try {
        const cloudData = await fetchCloudPortfolio();
        if (cloudData) {
          if (cloudData.personalInfo) setPersonalInfoState(cloudData.personalInfo);
          if (Array.isArray(cloudData.projects)) setProjectsState(cloudData.projects);
          if (Array.isArray(cloudData.skills)) setSkillsState(cloudData.skills);
          if (Array.isArray(cloudData.certifications)) setCertificationsState(cloudData.certifications);
          if (Array.isArray(cloudData.education)) setEducationState(cloudData.education);
          if (Array.isArray(cloudData.socialLinks)) setSocialLinksState(cloudData.socialLinks);
        }
      } catch (err) {
        console.warn("Cloud sync hydration notice:", err);
      }
    }
    hydrateFromCloud();
  }, []);

  // Save credentials helper for Admin Panel
  const saveCloudCredentials = (url, key) => {
    localStorage.setItem("portfolio_supabase_url", url.trim());
    localStorage.setItem("portfolio_supabase_key", key.trim());
    const creds = getSupabaseCredentials();
    setCloudStatus(creds);
    return creds;
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
    const timer = setTimeout(() => {
      saveCloudPortfolio({
        personalInfo,
        projects,
        skills,
        certifications,
        education,
        socialLinks,
      });
    }, 1200);
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

        // Cloud & Image Storage
        cloudStatus,
        saveCloudCredentials,
        uploadImageFile,

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
