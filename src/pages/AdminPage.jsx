import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  User,
  FolderGit2,
  Wrench,
  Award,
  GraduationCap,
  Share2,
  Settings,
  Download,
  RotateCcw,
  X,
  Sparkles,
  Loader2,
  RefreshCw,
  FileText,
} from "lucide-react";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { compressImageFile } from "../utils/imageCompressor";
import { SKILL_ICON_MAP, SOCIAL_ICON_OPTIONS, resolveSocialIcon } from "../utils/iconMap";

export default function AdminPage() {
  const {
    personalInfo,
    updatePersonalInfo,
    projects,
    addProject,
    updateProject,
    deleteProject,
    skills,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    certifications,
    addCertification,
    updateCertification,
    deleteCertification,
    education,
    addEducation,
    updateEducation,
    deleteEducation,
    socialLinks,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    changeAdminPin,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    cloudStatus,
    connectAndSyncCloud,
    syncNowToCloud,
    uploadImageFile,
    uploadResumeFile,
  } = usePortfolioData();

  // Auth State
  const [pinInput, setPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [authError, setAuthError] = useState("");

  // Navigation Tab
  const [activeTab, setActiveTab] = useState("profile");

  // Notification Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  // -------------------------------------------------------------
  // PIN LOGIN HANDLER
  // -------------------------------------------------------------
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    if (!pinInput.trim()) {
      setAuthError("Please enter your Admin PIN.");
      return;
    }
    const res = loginAdmin(pinInput);
    if (!res.success) {
      setAuthError(res.message || "Invalid PIN. Please try again.");
    } else {
      setPinInput("");
      showToast("Admin Panel unlocked successfully!");
    }
  };

  // -------------------------------------------------------------
  // PROFILE FORM STATE
  // -------------------------------------------------------------
  const [profileForm, setProfileForm] = useState(() => ({
    name: personalInfo?.name || "Khustar Hussain",
    initials: personalInfo?.initials || "KH",
    titles: Array.isArray(personalInfo?.titles) ? [...personalInfo.titles] : ["Java Developer"],
    email: personalInfo?.email || "",
    phone: personalInfo?.phone || "",
    location: personalInfo?.location || "",
    bio: personalInfo?.bio || "",
    shortBio: personalInfo?.shortBio || "",
    profilePhoto: personalInfo?.profilePhoto || "/portfolio image.jpeg",
    resumeUrl: personalInfo?.resumeUrl || "/Khustar_Hussain_Resume.pdf",
    currentRole: personalInfo?.currentRole || "",
    lookingFor: personalInfo?.lookingFor || "",
    yearsOfExperience: personalInfo?.yearsOfExperience || "",
    github: personalInfo?.github || "",
    linkedin: personalInfo?.linkedin || "",
  }));
  const [newTitleInput, setNewTitleInput] = useState("");

  // Automatically keep Admin input fields in sync when AI or external actions update personalInfo
  useEffect(() => {
    if (personalInfo) {
      setProfileForm({
        name: personalInfo.name || "Khustar Hussain",
        initials: personalInfo.initials || "KH",
        titles: Array.isArray(personalInfo.titles) ? [...personalInfo.titles] : ["Java Developer"],
        email: personalInfo.email || "",
        phone: personalInfo.phone || "",
        location: personalInfo.location || "",
        bio: personalInfo.bio || "",
        shortBio: personalInfo.shortBio || "",
        profilePhoto: personalInfo.profilePhoto || "/portfolio image.jpeg",
        resumeUrl: personalInfo.resumeUrl || "/Khustar_Hussain_Resume.pdf",
        currentRole: personalInfo.currentRole || "",
        lookingFor: personalInfo.lookingFor || "",
        yearsOfExperience: personalInfo.yearsOfExperience || "",
        github: personalInfo.github || "",
        linkedin: personalInfo.linkedin || "",
      });
    }
  }, [personalInfo]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updatePersonalInfo(profileForm);
    showToast("Profile details updated successfully!");
  };

  const handleAddTitle = () => {
    if (newTitleInput.trim()) {
      setProfileForm((prev) => ({
        ...prev,
        titles: [...(prev.titles || []), newTitleInput.trim()],
      }));
      setNewTitleInput("");
    }
  };

  const handleRemoveTitle = (idx) => {
    setProfileForm((prev) => ({
      ...prev,
      titles: (prev.titles || []).filter((_, i) => i !== idx),
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        let finalUrl = null;
        if (cloudStatus?.isConfigured) {
          finalUrl = await uploadImageFile(file, "profile");
        }
        if (!finalUrl) {
          finalUrl = await compressImageFile(file, 600, 600, 0.82);
        }
        setProfileForm((prev) => ({ ...prev, profilePhoto: finalUrl }));
        updatePersonalInfo({ profilePhoto: finalUrl });
        showToast(
          cloudStatus?.isConfigured
            ? "Photo uploaded to Cloud Storage (Visible globally)!"
            : "Profile photo updated!"
        );
      } catch (err) {
        showToast("Failed to process image file", "error");
      }
    }
  };

  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      showToast("Please select a valid PDF document (.pdf)", "error");
      return;
    }
    setIsUploadingResume(true);
    try {
      const res = await uploadResumeFile(file);
      if (res.success) {
        setProfileForm((prev) => ({ ...prev, resumeUrl: res.url }));
        updatePersonalInfo({ resumeUrl: res.url });
        showToast(res.message || "Resume PDF uploaded & updated successfully!");
      } else {
        showToast(res.message || "Failed to upload resume", "error");
      }
    } catch (err) {
      showToast(`Resume upload error: ${err.message}`, "error");
    } finally {
      setIsUploadingResume(false);
      e.target.value = "";
    }
  };

  // -------------------------------------------------------------
  // PROJECT MODAL & FORM STATE
  // -------------------------------------------------------------
  const [editingProject, setEditingProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    slug: "",
    duration: "",
    shortDescription: "",
    fullDescription: "",
    problemStatement: "",
    solution: "",
    technicalImplementation: "",
    challenges: "",
    keyLearnings: "",
    githubUrl: "",
    liveUrl: "",
    image: "",
    status: "featured",
    technologies: [],
    features: [],
  });
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: "",
      slug: "",
      duration: "",
      shortDescription: "",
      fullDescription: "",
      problemStatement: "",
      solution: "",
      technicalImplementation: "",
      challenges: "",
      keyLearnings: "",
      githubUrl: "",
      liveUrl: "",
      image: "",
      status: "featured",
      technologies: [],
      features: [],
    });
    setTechInput("");
    setFeatureInput("");
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      ...proj,
      technologies: Array.isArray(proj.technologies) ? [...proj.technologies] : [],
      features: Array.isArray(proj.features) ? [...proj.features] : [],
    });
    setTechInput("");
    setFeatureInput("");
    setIsProjectModalOpen(true);
  };

  const handleProjectImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        let finalUrl = null;
        // Try Supabase cloud storage first (same pattern as profile photo & certificate uploads)
        if (cloudStatus?.isConfigured) {
          try {
            finalUrl = await uploadImageFile(file, "projects");
          } catch (uploadErr) {
            console.warn("Supabase project image upload failed, falling back to local:", uploadErr.message);
          }
        }
        // Fallback: compress to Base64 for local storage
        if (!finalUrl) {
          finalUrl = await compressImageFile(file, 800, 600, 0.82);
        }
        setProjectForm((prev) => ({ ...prev, image: finalUrl }));
        showToast(
          cloudStatus?.isConfigured && finalUrl?.startsWith("http")
            ? "Project image uploaded to Cloud Storage (Visible globally)!"
            : "Project image optimized locally!"
        );
      } catch (err) {
        showToast("Failed to process image file", "error");
      }
    }
  };

  const handleAddProjectTech = () => {
    if (techInput.trim() && !projectForm.technologies.includes(techInput.trim())) {
      setProjectForm((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const handleRemoveProjectTech = (tech) => {
    setProjectForm((prev) => ({
      ...prev,
      technologies: (prev.technologies || []).filter((t) => t !== tech),
    }));
  };

  const handleAddProjectFeature = () => {
    if (featureInput.trim()) {
      setProjectForm((prev) => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveProjectFeature = (idx) => {
    setProjectForm((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== idx),
    }));
  };

  const handleProjectSave = (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      showToast("Project title is required", "error");
      return;
    }

    if (editingProject) {
      updateProject(editingProject.id, projectForm);
      showToast(`Updated project "${projectForm.title}"!`);
    } else {
      addProject(projectForm);
      showToast(`Added new project "${projectForm.title}"!`);
    }
    setIsProjectModalOpen(false);
  };

  // -------------------------------------------------------------
  // SKILLS STATE & MODAL
  // -------------------------------------------------------------
  const [editingSkillCat, setEditingSkillCat] = useState(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillCatForm, setSkillCatForm] = useState({ title: "", icon: "Code2", items: [] });
  const [skillItemInput, setSkillItemInput] = useState("");

  const openNewSkillModal = () => {
    setEditingSkillCat(null);
    setSkillCatForm({ title: "", icon: "Code2", items: [] });
    setSkillItemInput("");
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (cat) => {
    setEditingSkillCat(cat);
    setSkillCatForm({
      ...cat,
      icon: typeof cat.icon === "string" ? cat.icon : "Code2",
      items: Array.isArray(cat.items) ? [...cat.items] : [],
    });
    setSkillItemInput("");
    setIsSkillModalOpen(true);
  };

  const handleAddSkillItem = () => {
    if (skillItemInput.trim() && !skillCatForm.items.includes(skillItemInput.trim())) {
      setSkillCatForm((prev) => ({
        ...prev,
        items: [...(prev.items || []), skillItemInput.trim()],
      }));
      setSkillItemInput("");
    }
  };

  const handleRemoveSkillItem = (item) => {
    setSkillCatForm((prev) => ({
      ...prev,
      items: (prev.items || []).filter((i) => i !== item),
    }));
  };

  const handleSkillCatSave = (e) => {
    e.preventDefault();
    if (!skillCatForm.title.trim()) {
      showToast("Category title is required", "error");
      return;
    }
    if (editingSkillCat) {
      updateSkillCategory(editingSkillCat.id, skillCatForm);
      showToast(`Updated skill category "${skillCatForm.title}"!`);
    } else {
      addSkillCategory(skillCatForm);
      showToast(`Added skill category "${skillCatForm.title}"!`);
    }
    setIsSkillModalOpen(false);
  };

  // -------------------------------------------------------------
  // CERTIFICATIONS MODAL & STATE
  // -------------------------------------------------------------
  const [editingCert, setEditingCert] = useState(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState({
    title: "",
    organization: "",
    date: "",
    credentialUrl: "",
    verificationCode: "",
    description: "",
    skillsLearned: [],
    image: "",
  });
  const [certSkillInput, setCertSkillInput] = useState("");

  const openNewCertModal = () => {
    setEditingCert(null);
    setCertForm({
      title: "",
      organization: "",
      date: "",
      credentialUrl: "",
      verificationCode: "",
      description: "",
      skillsLearned: [],
      image: "",
    });
    setCertSkillInput("");
    setIsCertModalOpen(true);
  };

  const openEditCertModal = (cert) => {
    setEditingCert(cert);
    setCertForm({
      ...cert,
      skillsLearned: Array.isArray(cert.skillsLearned) ? [...cert.skillsLearned] : [],
    });
    setCertSkillInput("");
    setIsCertModalOpen(true);
  };

  const handleCertImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        let finalUrl = null;
        if (cloudStatus?.isConfigured) {
          finalUrl = await uploadImageFile(file, "certificates");
        }
        if (!finalUrl) {
          finalUrl = await compressImageFile(file, 600, 600, 0.82);
        }
        setCertForm((prev) => ({ ...prev, image: finalUrl }));
        showToast(
          cloudStatus?.isConfigured
            ? "Certificate badge uploaded to Cloud Storage!"
            : "Certificate badge uploaded!"
        );
      } catch (err) {
        showToast("Failed to process image file", "error");
      }
    }
  };

  const handleAddCertSkill = () => {
    if (certSkillInput.trim() && !certForm.skillsLearned.includes(certSkillInput.trim())) {
      setCertForm((prev) => ({
        ...prev,
        skillsLearned: [...(prev.skillsLearned || []), certSkillInput.trim()],
      }));
      setCertSkillInput("");
    }
  };

  const handleRemoveCertSkill = (s) => {
    setCertForm((prev) => ({
      ...prev,
      skillsLearned: (prev.skillsLearned || []).filter((item) => item !== s),
    }));
  };

  const handleCertSave = (e) => {
    e.preventDefault();
    if (!certForm.title.trim()) {
      showToast("Certificate title is required", "error");
      return;
    }
    if (editingCert) {
      updateCertification(editingCert.id, certForm);
      showToast(`Updated certificate "${certForm.title}"!`);
    } else {
      addCertification(certForm);
      showToast(`Added certificate "${certForm.title}"!`);
    }
    setIsCertModalOpen(false);
  };

  // -------------------------------------------------------------
  // EDUCATION MODAL & STATE
  // -------------------------------------------------------------
  const [editingEdu, setEditingEdu] = useState(null);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "",
    field: "",
    duration: "",
    location: "",
    score: "",
    highlights: [],
    coursework: [],
  });
  const [courseInput, setCourseInput] = useState("");

  const openNewEduModal = () => {
    setEditingEdu(null);
    setEduForm({
      institution: "",
      degree: "",
      field: "",
      duration: "",
      location: "",
      score: "",
      highlights: [],
      coursework: [],
    });
    setCourseInput("");
    setIsEduModalOpen(true);
  };

  const openEditEduModal = (edu) => {
    setEditingEdu(edu);
    setEduForm({
      ...edu,
      coursework: Array.isArray(edu.coursework) ? [...edu.coursework] : [],
      highlights: Array.isArray(edu.highlights) ? [...edu.highlights] : [],
    });
    setCourseInput("");
    setIsEduModalOpen(true);
  };

  const handleAddCourse = () => {
    if (courseInput.trim() && !eduForm.coursework.includes(courseInput.trim())) {
      setEduForm((prev) => ({
        ...prev,
        coursework: [...(prev.coursework || []), courseInput.trim()],
      }));
      setCourseInput("");
    }
  };

  const handleRemoveCourse = (c) => {
    setEduForm((prev) => ({
      ...prev,
      coursework: (prev.coursework || []).filter((item) => item !== c),
    }));
  };

  const handleEduSave = (e) => {
    e.preventDefault();
    if (!eduForm.institution.trim()) {
      showToast("Institution name is required", "error");
      return;
    }
    if (editingEdu) {
      updateEducation(editingEdu.id, eduForm);
      showToast(`Updated education at ${eduForm.institution}!`);
    } else {
      addEducation(eduForm);
      showToast(`Added education record!`);
    }
    setIsEduModalOpen(false);
  };

  // -------------------------------------------------------------
  // SOCIAL LINKS STATE & MODAL
  // -------------------------------------------------------------
  const [editingSocial, setEditingSocial] = useState(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialForm, setSocialForm] = useState({
    platform: "Instagram",
    url: "https://instagram.com/",
    username: "",
    icon: "instagram",
    iconName: "instagram",
    showInFooter: true,
    showInResume: true,
    showInContact: true,
  });

  const openNewSocialModal = () => {
    setEditingSocial(null);
    setSocialForm({
      platform: "Instagram",
      url: "https://instagram.com/",
      username: "",
      icon: "instagram",
      iconName: "instagram",
      showInFooter: true,
      showInResume: true,
      showInContact: true,
    });
    setIsSocialModalOpen(true);
  };

  const openEditSocialModal = (social) => {
    setEditingSocial(social);
    const resolvedIconName =
      (typeof social.iconName === "string" && social.iconName) ||
      (typeof social.icon === "string" && social.icon) ||
      (typeof social.platform === "string" && social.platform.toLowerCase()) ||
      "globe";
    setSocialForm({
      id: social.id,
      platform: social.platform || social.name || "",
      url: social.url || "",
      username: social.username || social.handle || "",
      icon: resolvedIconName,
      iconName: resolvedIconName,
      showInFooter: social.showInFooter !== false,
      showInResume: social.showInResume !== false,
      showInContact: social.showInContact !== false,
    });
    setIsSocialModalOpen(true);
  };

  const handleSocialSave = (e) => {
    e.preventDefault();
    if (!socialForm.platform.trim() || !socialForm.url.trim()) {
      showToast("Platform and URL are required", "error");
      return;
    }
    const iconId = (socialForm.iconName || socialForm.icon || socialForm.platform || "globe").toLowerCase();
    const targetId = editingSocial?.id || socialForm.id || `social-${Date.now()}`;
    const finalSocial = {
      ...socialForm,
      id: targetId,
      name: socialForm.platform,
      icon: iconId,
      iconName: iconId,
      showInFooter: socialForm.showInFooter !== false,
      showInResume: socialForm.showInResume !== false,
      showInContact: socialForm.showInContact !== false,
    };
    if (editingSocial) {
      updateSocialLink(targetId, finalSocial);
      showToast(`Updated ${socialForm.platform} link!`);
    } else {
      addSocialLink(finalSocial);
      showToast(`Added ${socialForm.platform} link!`);
    }
    setIsSocialModalOpen(false);
  };

  // -------------------------------------------------------------
  // SETTINGS: PIN CHANGE, CLOUD DB & BACKUP
  // -------------------------------------------------------------
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [importJsonText, setImportJsonText] = useState("");
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => cloudStatus?.url || "");
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => cloudStatus?.key || "");
  const importFileRef = useRef(null);

  const [isConnectingCloud, setIsConnectingCloud] = useState(false);

  const handleSaveCloudConfig = async (e) => {
    e.preventDefault();
    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
      showToast("Please provide both Supabase URL and Anon Key", "error");
      return;
    }
    setIsConnectingCloud(true);
    try {
      const res = await connectAndSyncCloud(supabaseUrlInput, supabaseKeyInput);
      if (res.success) {
        showToast(res.message || "Supabase connected! All data synced across all devices.");
      } else {
        showToast(res.message || "Connection failed. Please check credentials.", "error");
      }
    } catch (err) {
      showToast(`Connection error: ${err.message}`, "error");
    } finally {
      setIsConnectingCloud(false);
    }
  };

  const handleManualSync = async () => {
    setIsConnectingCloud(true);
    try {
      const res = await syncNowToCloud();
      if (res.success) {
        showToast("Live data pushed to Supabase Cloud successfully!");
      } else {
        showToast(`Sync failed: ${res.message}`, "error");
      }
    } catch (err) {
      showToast(`Sync error: ${err.message}`, "error");
    } finally {
      setIsConnectingCloud(false);
    }
  };

  const handlePinChangeSubmit = (e) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      showToast("PINs do not match", "error");
      return;
    }
    const res = changeAdminPin(newPin);
    if (res.success) {
      showToast(res.message);
      setNewPin("");
      setConfirmPin("");
    } else {
      showToast(res.message, "error");
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        const res = importDataJSON(text);
        if (res.success) {
          showToast(res.message);
        } else {
          showToast(res.message, "error");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportTextSubmit = (e) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const res = importDataJSON(importJsonText);
    if (res.success) {
      showToast(res.message);
      setImportJsonText("");
    } else {
      showToast(res.message, "error");
    }
  };

  const handleResetConfirm = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all portfolio data to original defaults? All customized additions will be removed."
      )
    ) {
      resetToDefaults();
      showToast("Reset to defaults completed!");
    }
  };

  // =============================================================
  // LOCK SCREEN (IF NOT AUTHENTICATED)
  // =============================================================
  if (!isAdminAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-20 relative">
        <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/80 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
            <Lock size={30} />
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Portfolio Admin Access
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Enter your Admin PIN to manage and update your portfolio content in real-time.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Admin PIN"
                autoFocus
                className="w-full px-4 py-3.5 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center tracking-widest text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {authError && (
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertCircle size={14} />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock size={18} />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
              ← Return to Portfolio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =============================================================
  // MAIN ADMIN DASHBOARD
  // =============================================================
  return (
    <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === "error"
              ? "bg-red-500/90 border-red-400 text-white"
              : "bg-blue-600/95 border-blue-400 text-white"
          }`}
        >
          {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP ADMIN BAR */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Portfolio Control Panel
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Manage your profile, projects, skills, certificates, and live website content.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs md:text-sm font-semibold rounded-xl transition-all"
          >
            <span>Live Portfolio</span>
            <ExternalLink size={14} />
          </Link>
          <button
            onClick={() => {
              logoutAdmin();
              showToast("Logged out successfully");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs md:text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-4.5 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FolderGit2 size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Projects</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{(projects || []).length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-4.5 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Wrench size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Skill Sets</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{(skills || []).length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-4.5 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Certs</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{(certifications || []).length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-4.5 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Education</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{(education || []).length}</p>
          </div>
        </div>
      </div>

      {/* DASHBOARD TABS CONTAINER */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/80 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        {/* TAB NAVIGATION HEADER */}
        <div className="border-b border-slate-200 dark:border-slate-700/80 px-6 py-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "profile", label: "Profile & Bio", icon: User },
            { id: "resume", label: "Edit Resume Page", icon: FileText },
            { id: "projects", label: "Projects", icon: FolderGit2, count: (projects || []).length },
            { id: "skills", label: "Skills", icon: Wrench, count: (skills || []).length },
            { id: "certifications", label: "Certificates", icon: Award, count: (certifications || []).length },
            { id: "education", label: "Education", icon: GraduationCap, count: (education || []).length },
            { id: "socials", label: "Social Links", icon: Share2, count: (socialLinks || []).length },
            { id: "settings", label: "Settings & Backup", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div key={activeTab} className="p-6 md:p-8 animate-smooth-fade">
          {/* ========================================================= */}
          {/* TAB 1: PROFILE & PERSONAL INFO */}
          {/* ========================================================= */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Personal & Profile Details
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update your display name, titles, bio, photo, and contact information.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Photo & Resume Upload Column */}
                <div className="space-y-4">
                  {/* Photo upload */}
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col items-center text-center">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 mb-4 border-2 border-blue-500/30 relative group shadow-md">
                      <img
                        src={profileForm.profilePhoto}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <label className="w-full py-2.5 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-blue-500 cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs">
                      <Upload size={14} />
                      <span>Upload New Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Auto-optimized on upload (JPG, PNG, WEBP)
                    </p>
                  </div>

                  {/* Resume PDF Upload */}
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 shadow-xs">
                      <FileText size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      Resume Document (PDF)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                      Upload your customized resume PDF. Replaces previous resume and updates the download link live.
                    </p>

                    <label className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20">
                      {isUploadingResume ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Uploading Resume...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Upload Custom Resume PDF</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        disabled={isUploadingResume}
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>

                    {personalInfo?.resumeUrl && (
                      <a
                        href={personalInfo.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download="Khustar_Hussain_Resume.pdf"
                        className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Preview / Download Active PDF</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Names & Contact */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Display Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name || ""}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Initials (for Logo)
                      </label>
                      <input
                        type="text"
                        value={profileForm.initials || ""}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, initials: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email || ""}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone || ""}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Location / City
                      </label>
                      <input
                        type="text"
                        value={profileForm.location || ""}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, location: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Resume File URL
                      </label>
                      <input
                        type="text"
                        value={profileForm.resumeUrl || ""}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, resumeUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Titles / Roles Tag Manager */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Professional Titles & Roles
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(profileForm.titles || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTitle(idx)}
                        className="text-blue-500 hover:text-red-500 cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTitleInput}
                    onChange={(e) => setNewTitleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTitle();
                      }
                    }}
                    placeholder="Add a new title (e.g. Full Stack Engineer)..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTitle}
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    Add Title
                  </button>
                </div>
              </div>

              {/* Bio & Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Professional Bio (Summary Section)
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio || ""}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Short Hero Pitch
                </label>
                <input
                  type="text"
                  value={profileForm.shortBio || ""}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, shortBio: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB: EDIT RESUME PAGE */}
          {/* ========================================================= */}
          {activeTab === "resume" && (
            <div className="space-y-8 max-w-4xl animate-smooth-fade">
              {/* Header Preview & Live Link Banner */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-white/15">
                <div>
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                    📄 Live Resume Page Editor
                  </span>
                  <h2 className="text-xl md:text-2xl font-black">
                    Customize Your Public Resume Page
                  </h2>
                  <p className="text-xs md:text-sm text-blue-100 mt-1 max-w-xl">
                    Control every detail on your public <code>/resume</code> route, update your resume PDF file, and manage professional summary and contacts.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    to="/resume"
                    target="_blank"
                    className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs md:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>View Live Resume</span>
                    <ExternalLink size={15} />
                  </Link>
                </div>
              </div>

              {/* PDF Document Cloud Upload Card */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 md:p-7 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Upload & Update Resume Document (PDF)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Upload your PDF file to replace the old resume globally in Supabase Cloud Storage.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-2 transition-all shadow-md shadow-blue-500/20">
                      {isUploadingResume ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Upload New PDF</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        disabled={isUploadingResume}
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>

                    {personalInfo?.resumeUrl && (
                      <a
                        href={personalInfo.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download="Khustar_Hussain_Resume.pdf"
                        className="px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Download size={14} />
                        <span>Download Active PDF</span>
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  <span>
                    Active resume link: <code className="text-blue-600 dark:text-blue-400 text-[11px] break-all">{personalInfo?.resumeUrl || "/Khustar_Hussain_Resume.pdf"}</code>
                  </span>
                </p>
              </div>

              {/* Resume Header & Profile Information Form */}
              <form onSubmit={handleProfileSave} className="space-y-6 bg-white dark:bg-slate-800/30 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Resume Header & Profile Details
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Edit the display name, professional titles, and summary that appear on your resume page.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={16} />
                    <span>Save Resume Info</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name on Resume *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      placeholder="e.g. Bhopal, Madhya Pradesh, India"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      GitHub Profile URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.github}
                      onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.linkedin}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Professional Titles on Resume */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Professional Titles (Subtitle on Resume)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(profileForm.titles || []).map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-xl border border-blue-200 dark:border-blue-800"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTitle(idx)}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTitleInput}
                      onChange={(e) => setNewTitleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTitle();
                        }
                      }}
                      placeholder="e.g. Java Backend Developer, Spring Boot Engineer..."
                      className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTitle}
                      className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
                    >
                      Add Title
                    </button>
                  </div>
                </div>

                {/* Professional Summary / Bio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Professional Summary (Appears under SUMMARY section on Resume)
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Write a concise executive summary of your backend expertise, passion for building scalable web apps, and problem-solving skills..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </form>

              {/* Resume Dynamic Sections Quick Hub */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Resume Content Sections
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  These dynamic sections are automatically synced with your Resume page. Click any card to edit its records:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("skills")}
                    className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all text-left shadow-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Wrench size={18} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full">
                        {(skills || []).length} Categories
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Technical Skills</p>
                    <p className="text-[11px] text-slate-400">Manage categories & tags</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("projects")}
                    className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all text-left shadow-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <FolderGit2 size={18} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full">
                        {(projects || []).length} Projects
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Featured Projects</p>
                    <p className="text-[11px] text-slate-400">Streakify, BrightPath...</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("certifications")}
                    className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all text-left shadow-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Award size={18} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full">
                        {(certifications || []).length} Certs
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Certifications</p>
                    <p className="text-[11px] text-slate-400">AWS, HackerRank...</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("education")}
                    className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all text-left shadow-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <GraduationCap size={18} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full">
                        {(education || []).length} Records
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Education</p>
                    <p className="text-[11px] text-slate-400">B.Tech & College info</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PROJECTS MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Projects ({(projects || []).length})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add new projects or edit case studies, tech tags, and demo links.
                  </p>
                </div>
                <button
                  onClick={openNewProjectModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Projects List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(projects || []).map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {proj.title}
                          </h3>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                            proj.status === "featured"
                              ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {proj.status || "featured"}
                        </span>
                      </div>

                      {proj.duration && (
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                          📅 {proj.duration}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                        {proj.shortDescription}
                      </p>

                      {/* Tech Pills preview */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(proj.technologies || []).slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                          >
                            {t}
                          </span>
                        ))}
                        {(proj.technologies || []).length > 5 && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">
                            +{proj.technologies.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60">
                      <Link
                        to={`/projects/${proj.slug || proj.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>Preview Page</span>
                        <ExternalLink size={12} />
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProjectModal(proj)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete project "${proj.title}"?`)) {
                              deleteProject(proj.id);
                              showToast(`Project deleted!`);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SKILLS MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Skills Categories ({(skills || []).length})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Group skills into categories and manage individual technology tags.
                  </p>
                </div>
                <button
                  onClick={openNewSkillModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Skill Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(skills || []).map((skillCat) => (
                  <div
                    key={skillCat.id}
                    className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {skillCat.title}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditSkillModal(skillCat)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete category "${skillCat.title}"?`)) {
                                deleteSkillCategory(skillCat.id);
                                showToast("Skill category deleted!");
                              }
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {(skillCat.items || []).map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CERTIFICATIONS */}
          {/* ========================================================= */}
          {activeTab === "certifications" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Certifications ({(certifications || []).length})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage certified credentials, verification codes, and skills tags.
                  </p>
                </div>
                <button
                  onClick={openNewCertModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Certificate</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(certifications || []).map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                            {cert.title}
                          </h3>
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {cert.organization} — {cert.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditCertModal(cert)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete certificate "${cert.title}"?`)) {
                                deleteCertification(cert.id);
                                showToast("Certificate deleted!");
                              }
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 inline-flex items-center gap-1 mb-3"
                        >
                          <span>Credential Link</span>
                          <ExternalLink size={12} />
                        </a>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(cert.skillsLearned || []).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: EDUCATION */}
          {/* ========================================================= */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Education ({(education || []).length})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage degrees, universities, scores, and academic milestones.
                  </p>
                </div>
                <button
                  onClick={openNewEduModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Education Record</span>
                </button>
              </div>

              <div className="space-y-4">
                {(education || []).map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                        </h3>
                        {edu.score && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md">
                            {edu.score}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {edu.institution}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {edu.duration} • {edu.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => openEditEduModal(edu)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete education at ${edu.institution}?`)) {
                            deleteEducation(edu.id);
                            showToast("Education record deleted!");
                          }
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: SOCIAL LINKS */}
          {/* ========================================================= */}
          {activeTab === "socials" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Social & Contact Links ({(socialLinks || []).length})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add or update your GitHub, LinkedIn, Twitter, Email, and other profile links.
                  </p>
                </div>
                <button
                  onClick={openNewSocialModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Social Link</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(socialLinks || []).map((social) => {
                  const SocialIcon = resolveSocialIcon(social);
                  return (
                    <div
                      key={social.id}
                      className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3 group hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-700/60 border border-blue-100 dark:border-slate-600 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <SocialIcon size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-extrabold tracking-wider text-blue-600 dark:text-blue-400">
                            {social.platform}
                          </p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {social.username || social.platform}
                          </p>
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 truncate block"
                          >
                            {social.url}
                          </a>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {social.showInFooter !== false && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded">
                                Footer
                              </span>
                            )}
                            {social.showInResume !== false && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 rounded">
                                Resume
                              </span>
                            )}
                            {social.showInContact !== false && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 rounded">
                                Contact
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openEditSocialModal(social)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            deleteSocialLink(social.id);
                            showToast(`Deleted ${social.platform || "social"} link!`);
                          }}
                          title={`Delete ${social.platform} link`}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: SETTINGS & BACKUP */}
          {/* ========================================================= */}
          {activeTab === "settings" && (
            <div className="space-y-8 max-w-3xl">
              {/* Cloud Database & Storage Section (Supabase) */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/70">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      ⚡
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Cloud Database & Storage (Supabase)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Enables real-time global syncing across all devices and permanent photo hosting.
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      cloudStatus?.isConfigured
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {cloudStatus?.isConfigured
                      ? "🟢 Cloud Connected (Live Across All Devices)"
                      : "⚪ Local Browser Mode"}
                  </span>
                </div>

                <form onSubmit={handleSaveCloudConfig} className="space-y-4 max-w-xl mt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Supabase Anon / Public API Key
                    </label>
                    <input
                      type="password"
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isConnectingCloud}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
                    >
                      {isConnectingCloud ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Testing & Syncing...</span>
                        </>
                      ) : (
                        <span>Connect & Sync Cloud</span>
                      )}
                    </button>

                    {cloudStatus?.isConfigured && (
                      <button
                        type="button"
                        onClick={handleManualSync}
                        disabled={isConnectingCloud}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw size={14} className={isConnectingCloud ? "animate-spin" : ""} />
                        <span>Force Sync to Cloud</span>
                      </button>
                    )}

                    <a
                      href="https://supabase.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Supabase Dashboard</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </form>
              </div>

              {/* PIN Change Section */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/70">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Change Admin PIN
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Set a new PIN code for unlocking the Admin Panel.
                </p>

                <form onSubmit={handlePinChangeSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      New Admin PIN (Min 4 chars)
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="e.g. 8492"
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm New PIN
                    </label>
                    <input
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Re-type new PIN"
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    Update PIN Code
                  </button>
                </form>
              </div>

              {/* Export & Import Backup */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/70">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Export & Import Data Backup
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Export all your portfolio data to a JSON backup file or import existing JSON.
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <button
                    onClick={exportDataJSON}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Download size={15} />
                    <span>Download JSON Backup</span>
                  </button>

                  <label className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs">
                    <Upload size={15} />
                    <span>Upload JSON Backup File</span>
                    <input
                      ref={importFileRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Paste JSON */}
                <form onSubmit={handleImportTextSubmit} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Or Paste JSON Data Directly:
                  </label>
                  <textarea
                    rows={4}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='{"personalInfo": { ... }, "projects": [ ... ]}'
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    Apply Pasted JSON
                  </button>
                </form>
              </div>

              {/* Reset to Original Defaults */}
              <div className="bg-red-50/50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-200 dark:border-red-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-red-700 dark:text-red-400 mb-1">
                    Reset to Code Defaults
                  </h3>
                  <p className="text-xs text-red-600/80 dark:text-red-400/70">
                    Restore the original portfolio data bundled with the repository.
                  </p>
                </div>
                <button
                  onClick={handleResetConfirm}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <RotateCcw size={15} />
                  <span>Reset All Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODAL: PROJECT ADD / EDIT */}
      {/* ============================================================= */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProjectSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    placeholder="e.g. Streakify — Gamified DSA Platform"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Duration / Dates
                  </label>
                  <input
                    type="text"
                    value={projectForm.duration || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, duration: e.target.value })
                    }
                    placeholder="e.g. May 2025 – June 2025"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Display Status
                  </label>
                  <select
                    value={projectForm.status || "featured"}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, status: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="featured">Featured (Top Priority)</option>
                    <option value="completed">Completed / Archive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    URL Slug (Case Study Route)
                  </label>
                  <input
                    type="text"
                    value={projectForm.slug || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, slug: e.target.value })
                    }
                    placeholder="e.g. brightpath (auto-generated if empty)"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.liveUrl || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, liveUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.githubUrl || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Project Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Project Image (Upload File or Image URL)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={projectForm.image || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, image: e.target.value })
                    }
                    placeholder="Image URL or upload file below..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <label className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer flex items-center gap-1.5">
                    <Upload size={14} />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Short Summary (Card Preview)
                </label>
                <textarea
                  rows={2}
                  value={projectForm.shortDescription || ""}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Overview & Case Study
                </label>
                <textarea
                  rows={3}
                  value={projectForm.fullDescription || ""}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      fullDescription: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Problem Statement
                  </label>
                  <textarea
                    rows={2}
                    value={projectForm.problemStatement || ""}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        problemStatement: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Solution Provided
                  </label>
                  <textarea
                    rows={2}
                    value={projectForm.solution || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, solution: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Technologies Tag Manager */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(projectForm.technologies || []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveProjectTech(t)}
                        className="text-blue-400 hover:text-red-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddProjectTech();
                      }
                    }}
                    placeholder="Add technology (e.g. Next.js)..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddProjectTech}
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    Add Tech
                  </button>
                </div>
              </div>

              {/* Key Features Bullet Points */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Key Features & Highlights
                </label>
                <div className="space-y-1.5 mb-2">
                  {(projectForm.features || []).map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-800 dark:text-slate-200"
                    >
                      <span>• {f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProjectFeature(idx)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddProjectFeature();
                      }
                    }}
                    placeholder="Add a key feature bullet point..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddProjectFeature}
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    Add Feature
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>{editingProject ? "Update Project" : "Save Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: SKILL CATEGORY */}
      {/* ============================================================= */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingSkillCat ? "Edit Skill Category" : "Add Skill Category"}
              </h2>
              <button
                onClick={() => setIsSkillModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSkillCatSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category Title *
                </label>
                <input
                  type="text"
                  required
                  value={skillCatForm.title}
                  onChange={(e) =>
                    setSkillCatForm({ ...skillCatForm, title: e.target.value })
                  }
                  placeholder="e.g. Backend Frameworks & Architecture"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category Icon
                </label>
                <select
                  value={skillCatForm.icon || "Code2"}
                  onChange={(e) =>
                    setSkillCatForm({ ...skillCatForm, icon: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {Object.keys(SKILL_ICON_MAP).map((iconKey) => (
                    <option key={iconKey} value={iconKey}>
                      {iconKey}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Skills in this Category
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(skillCatForm.items || []).map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillItem(item)}
                        className="text-blue-400 hover:text-red-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillItemInput}
                    onChange={(e) => setSkillItemInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkillItem();
                      }
                    }}
                    placeholder="Add skill (e.g. Spring Boot)..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkillItem}
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: CERTIFICATION */}
      {/* ============================================================= */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingCert ? "Edit Certification" : "Add Certification"}
              </h2>
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCertSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) =>
                    setCertForm({ ...certForm, title: e.target.value })
                  }
                  placeholder="e.g. AWS Academy Graduate - AWS Cloud Foundations"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={certForm.organization || ""}
                    onChange={(e) =>
                      setCertForm({ ...certForm, organization: e.target.value })
                    }
                    placeholder="e.g. Amazon Web Services (AWS)"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={certForm.date || ""}
                    onChange={(e) =>
                      setCertForm({ ...certForm, date: e.target.value })
                    }
                    placeholder="e.g. 2024"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Credential Link URL
                  </label>
                  <input
                    type="url"
                    value={certForm.credentialUrl || ""}
                    onChange={(e) =>
                      setCertForm({ ...certForm, credentialUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Verification / Certificate ID
                  </label>
                  <input
                    type="text"
                    value={certForm.verificationCode || ""}
                    onChange={(e) =>
                      setCertForm({ ...certForm, verificationCode: e.target.value })
                    }
                    placeholder="e.g. AWS-12345"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Skills Learned
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(certForm.skillsLearned || []).map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveCertSkill(s)}
                        className="text-blue-400 hover:text-red-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={certSkillInput}
                    onChange={(e) => setCertSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCertSkill();
                      }
                    }}
                    placeholder="Add skill tag..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCertSkill}
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: EDUCATION */}
      {/* ============================================================= */}
      {isEduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingEdu ? "Edit Education" : "Add Education Record"}
              </h2>
              <button
                onClick={() => setIsEduModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEduSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Institution / University Name *
                </label>
                <input
                  type="text"
                  required
                  value={eduForm.institution}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, institution: e.target.value })
                  }
                  placeholder="e.g. Technocrats Institute of Technology (Excellence)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={eduForm.degree || ""}
                    onChange={(e) =>
                      setEduForm({ ...eduForm, degree: e.target.value })
                    }
                    placeholder="e.g. B.Tech"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Field of Study / Major
                  </label>
                  <input
                    type="text"
                    value={eduForm.field || ""}
                    onChange={(e) =>
                      setEduForm({ ...eduForm, field: e.target.value })
                    }
                    placeholder="e.g. Artificial Intelligence & Machine Learning"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={eduForm.duration || ""}
                    onChange={(e) =>
                      setEduForm({ ...eduForm, duration: e.target.value })
                    }
                    placeholder="e.g. 2021 – 2025"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eduForm.location || ""}
                    onChange={(e) =>
                      setEduForm({ ...eduForm, location: e.target.value })
                    }
                    placeholder="e.g. Bhopal, MP"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Score / CGPA
                  </label>
                  <input
                    type="text"
                    value={eduForm.score || ""}
                    onChange={(e) =>
                      setEduForm({ ...eduForm, score: e.target.value })
                    }
                    placeholder="e.g. CGPA: 7.77"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Coursework / Subjects
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(eduForm.coursework || []).map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(c)}
                        className="text-blue-400 hover:text-red-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCourse();
                      }
                    }}
                    placeholder="Add subject (e.g. Data Structures)..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEduModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: SOCIAL LINK */}
      {/* ============================================================= */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingSocial ? "Edit Social Link" : "Add Social Link"}
              </h2>
              <button
                onClick={() => setIsSocialModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSocialSave} className="space-y-4">
              {/* Quick Platform Icon Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Platform & Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                  {SOCIAL_ICON_OPTIONS.map((item) => {
                    const OptionIcon = item.icon;
                    const isSelected =
                      socialForm.icon === item.id ||
                      socialForm.platform?.toLowerCase() === item.label.toLowerCase() ||
                      socialForm.platform?.toLowerCase() === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSocialForm((prev) => ({
                            ...prev,
                            platform: item.label,
                            icon: item.id,
                            iconName: item.id,
                            url: prev.url && prev.url !== "https://" ? prev.url : item.defaultBaseUrl,
                          }));
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-700"
                        }`}
                        title={item.label}
                      >
                        <OptionIcon size={18} />
                        <span className="text-[9px] font-bold truncate w-full text-center">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  value={socialForm.platform}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, platform: e.target.value })
                  }
                  placeholder="e.g. GitHub, LinkedIn, Instagram, Telegram, Medium..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  URL / Web Address *
                </label>
                <input
                  type="text"
                  required
                  value={socialForm.url}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Username / Handle
                </label>
                <input
                  type="text"
                  value={socialForm.username || ""}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, username: e.target.value })
                  }
                  placeholder="e.g. khustar04"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Display Locations Checkboxes */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Display In Sections (Choose where this link appears)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={socialForm.showInFooter !== false}
                      onChange={(e) =>
                        setSocialForm((prev) => ({
                          ...prev,
                          showInFooter: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Footer Section
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={socialForm.showInResume !== false}
                      onChange={(e) =>
                        setSocialForm((prev) => ({
                          ...prev,
                          showInResume: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Resume Page
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={socialForm.showInContact !== false}
                      onChange={(e) =>
                        setSocialForm((prev) => ({
                          ...prev,
                          showInContact: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Contact Section
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSocialModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
