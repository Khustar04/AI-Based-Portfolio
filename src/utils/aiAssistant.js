import { personalInfo as defaultPersonalInfo } from "../data/personalInfo";
import { skills as defaultSkills } from "../data/skills";
import { projects as defaultProjects } from "../data/projects";
import { certifications as defaultCertifications } from "../data/certifications";
import { education as defaultEducation } from "../data/education";
import { personalDetails } from "../data/personalDetails";

// Comprehensive structured portfolio map for full navigation access
export const portfolioNavigationMap = {
  sections: [
    { id: "about", name: "About / Hero", hash: "#about", desc: "Top hero section, summary, and photo" },
    { id: "skills", name: "Technical Skills", hash: "#skills", desc: "Core Java, Backend Frameworks, Testing, Frontend, Databases, Tools & Concepts" },
    { id: "projects", name: "Featured Projects", hash: "#projects", desc: "Streakify (Gamified DSA Tracker), BrightPath & AI-Powered Job Finder" },
    { id: "certifications", name: "Certifications", hash: "#certifications", desc: "AWS Academy & HackerRank Certifications" },
    { id: "education", name: "Education Timeline", hash: "#education", desc: "B.Tech AI & ML (TIT Excellence) & Science Intermediate (Z.A. Islamia)" },
    { id: "contact", name: "Contact & Socials", hash: "#contact", desc: "Message form, email, phone, GitHub, LinkedIn" },
  ],
  pages: [
    { path: "/", name: "Home Page" },
    { path: "/resume", name: "Full Resume Page" },
    { path: "/projects/streakify", name: "Streakify DSA Platform Case Study" },
    { path: "/projects/brightpath", name: "BrightPath E-Learning Platform Case Study" },
    { path: "/projects/ai-job-finder", name: "AI-Powered Job Finder Case Study" },
    { path: "/manage-portfolio", name: "Admin Control Panel (PIN Protected)" },
  ],
};

function buildGeminiContents(messageHistory = [], userMessage = "") {
  const contents = [];

  // Retain up to 30 recent conversational turns for deep context memory
  const relevantHistory = messageHistory.slice(-30);

  for (const msg of relevantHistory) {
    if (msg.role === "user" && msg.content?.trim()) {
      contents.push({ role: "user", parts: [{ text: msg.content.trim() }] });
    } else if (msg.role === "assistant" && msg.content?.trim()) {
      contents.push({ role: "model", parts: [{ text: msg.content.trim() }] });
    }
  }

  // Gemini API requires the first turn to be 'user'
  while (contents.length && contents[0].role !== "user") {
    contents.shift();
  }

  // Ensure the latest user message is present at the end of the history
  const cleanUserMsg = (userMessage || "").trim();
  if (cleanUserMsg) {
    if (!contents.length || contents[contents.length - 1].parts?.[0]?.text !== cleanUserMsg) {
      contents.push({ role: "user", parts: [{ text: cleanUserMsg }] });
    }
  }

  return contents;
}

function buildPersonalKnowledge(data) {
  const d = personalDetails || {};
  const socials = d.socials || {};
  const personality = d.personality || {};
  const relationship = d.relationship || {};
  const friends = d.friends || {};
  const favorites = d.favorites || {};
  const background = d.background || {};
  const customQA = Array.isArray(d.customQA) ? d.customQA : [];
  const info = data?.personalInfo || defaultPersonalInfo;

  return `
PERSONAL & SOCIAL INFO:
• Instagram: ${socials.instagramHandle || "@khustar_04"}
• GitHub: ${info.github || socials.github}
• LinkedIn: ${info.linkedin || socials.linkedin}
• Twitter: ${socials.twitter || ""}
• Discord: ${socials.discord || ""}

PERSONALITY: ${personality.summary || ""}
Traits: ${(personality.traits || []).join(", ")}

RELATIONSHIP STATUS: ${relationship.status || ""}

FRIENDS & CIRCLE: ${friends.summary || ""}

HOBBIES & INTERESTS: ${(d.hobbies || []).join(", ")}

FAVORITES:
• Primary Language: ${favorites.primaryLanguage || "Java"}
• Editor: ${favorites.preferredEditor || "IntelliJ IDEA"}
• Frontend: ${favorites.frontendFramework || "React.js / Next.js"}
• Database: ${favorites.database || "MySQL"}
• Beverage: ${favorites.beverage || "Chai"}

BACKGROUND:
• Hometown: ${background.hometown || "Gopalganj, Bihar"}
• Current Location: ${info.location || "Bhopal, Madhya Pradesh"}
• Education: ${background.education || "B.Tech in CSE (AI & ML)"}

CUSTOM Q&A:
${customQA.map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`).join("\n\n")}`;
}

export function buildCompactContext(liveData) {
  const info = liveData?.personalInfo || defaultPersonalInfo;
  const skillsList = liveData?.skills || defaultSkills;
  const projectsList = liveData?.projects || defaultProjects;
  const certsList = liveData?.certifications || defaultCertifications;
  const eduList = liveData?.education || defaultEducation;

  const titlesStr = Array.isArray(info.titles)
    ? info.titles.join(" | ")
    : info.titles || "Java Developer";

  return `DEVELOPER: ${info.name || "Khustar Hussain"} | Role: ${titlesStr} | Location: ${info.location || ""} | Phone: ${info.phone || ""} | Email: ${info.email || ""}
GITHUB: ${info.github || ""} | LINKEDIN: ${info.linkedin || ""}
SUMMARY: ${info.bio || ""}

SKILLS:
${(skillsList || []).map((s) => `• ${s.title}: ${(s.items || []).join(", ")}`).join("\n")}

PROJECTS:
${(projectsList || []).map((p, i) => `${i + 1}. ${p.title} (Status: ${p.status || "featured"}):
   - Technologies: ${(p.technologies || []).join(", ")}
   - Summary: ${p.shortDescription || ""}
   - Live URL: ${p.liveUrl || "N/A"} | GitHub: ${p.githubUrl || "N/A"}`).join("\n\n")}

CERTIFICATIONS:
${(certsList || []).map((c) => `• ${c.title} (${c.organization} — ${c.date})`).join("\n")}

EDUCATION:
${(eduList || []).map((e) => `• ${e.degree} in ${e.field} — ${e.institution} (${e.duration}, ${e.location})`).join("\n")}
${buildPersonalKnowledge(liveData)}

PORTFOLIO NAVIGATION:
- Skills section: [🛠️ View Skills Section](#skills)
- Projects section: [🚀 View Featured Projects](#projects)
- Certifications section: [📜 View Certifications](#certifications)
- Education section: [🎓 View Education Timeline](#education)
- Contact form: [✉️ Open Contact Form](#contact)
- Full Resume page: [📄 Open Resume Page](/resume)`;
}

export function getSystemPrompt(isAdminMode = false, liveData = null) {
  const baseContext = buildCompactContext(liveData);
  const info = liveData?.personalInfo || defaultPersonalInfo;

  if (isAdminMode) {
    return `You are Khustar's AI Executive Assistant with FULL ADMIN ACCESS to the Portfolio Control Panel.
You are currently interacting with the verified site administrator (${info.name}) inside the authenticated Admin Panel.

YOUR PRIVILEGED CAPABILITIES:
1. DIRECT COMMAND EXECUTION:
   When the admin asks you to add, modify, delete, or update any project, skill, bio, contact details, certification, or education, you MUST execute it by including an ACTION BLOCK at the end of your answer.

ACTION BLOCK FORMAT:
[ACTION: <actionName>] { <JSON arguments> } [/ACTION]

AVAILABLE ADMIN ACTIONS:
- updatePersonalInfo:
  [ACTION: updatePersonalInfo] { "name": "...", "bio": "...", "shortBio": "...", "email": "...", "phone": "...", "location": "...", "resumeUrl": "...", "github": "...", "linkedin": "..." } [/ACTION]
- addProject:
  [ACTION: addProject] { "title": "...", "shortDescription": "...", "fullDescription": "...", "technologies": ["React", "Next.js"], "features": ["Feature 1", "Feature 2"], "liveUrl": "https://...", "githubUrl": "https://...", "duration": "...", "status": "featured" } [/ACTION]
- updateProject:
  [ACTION: updateProject] { "id": "project-id-or-title", "title": "...", "shortDescription": "...", "technologies": [...] } [/ACTION]
- deleteProject:
  [ACTION: deleteProject] { "title": "Project Title or ID" } [/ACTION]
- addSkillCategory:
  [ACTION: addSkillCategory] { "title": "DevOps & Cloud", "icon": "Cloud", "items": ["Docker", "Kubernetes", "AWS"] } [/ACTION]
- addSkillToCategory:
  [ACTION: addSkillToCategory] { "categoryTitle": "Tools & Platforms", "skill": "Docker" } [/ACTION]
- deleteSkillCategory:
  [ACTION: deleteSkillCategory] { "title": "Category Title" } [/ACTION]
- addCertification:
  [ACTION: addCertification] { "title": "...", "organization": "...", "date": "2025", "credentialUrl": "...", "skillsLearned": ["..."] } [/ACTION]
- deleteCertification:
  [ACTION: deleteCertification] { "title": "Cert Title" } [/ACTION]
- addEducation:
  [ACTION: addEducation] { "institution": "...", "degree": "...", "field": "...", "duration": "...", "location": "...", "score": "..." } [/ACTION]
- addSocialLink:
  [ACTION: addSocialLink] { "platform": "Twitter", "url": "https://...", "username": "..." } [/ACTION]
- exportBackup:
  [ACTION: exportBackup] {} [/ACTION]
- resetDefaults:
  [ACTION: resetDefaults] {} [/ACTION]

2. GENERAL KNOWLEDGE & TECHNICAL QUESTIONS:
   You can answer any question about software engineering, Java, algorithms, databases, Git/GitHub, system design, or architecture clearly, accurately, and thoroughly.

CURRENT LIVE PORTFOLIO STATE:
${baseContext}`;
  }

  // PUBLIC / VISITOR MODE:
  return `You are FRIDAY, the official AI Portfolio Assistant for ${info.name} (${info.name}'s personal software engineering portfolio).

STRICT PORTFOLIO FOCUS & RULES:
1. You are 100% PORTFOLIO-ORIENTED. Your sole focus is to represent ${info.name} accurately to visitors, hiring managers, and recruiters.
2. Answer questions exclusively about ${info.name}'s:
   • Technical skills (Core Java, Spring Boot, React, MySQL, Hibernate, Docker, REST APIs, DSA)
   • Featured projects (e.g. Streakify - DSA tracker, BrightPath - E-Learning platform, AI-Powered Job Finder)
   • Academic background & education (B.Tech in AI & ML at TIT Excellence, Intermediate at Z.A. Islamia)
   • Professional certifications (AWS Academy Cloud Foundations, HackerRank Java/Problem Solving)
   • Experience, biography, resume, and contact channels.
3. TECH QUESTIONS RELATION: If a user asks about software engineering concepts or technologies (e.g. "What is Spring Boot?", "What is Java?", "What is DSA?"), explain the concept concisely and ALWAYS connect it directly to how ${info.name} implements and uses it in his portfolio projects.
4. STRICT OFF-TOPIC REJECTION: If a user asks random, irrelevant, or non-portfolio questions (e.g. cooking, jokes, news, gaming, essay writing, unrelated homework):
   Politely decline and redirect back to ${info.name}:
   "I am ${info.name}'s Portfolio Assistant. I'm specialized in answering questions about ${info.name}'s software development work, tech stack, projects, and background. What would you like to know about his projects or skills?"

QUALITY & ACCURACY:
1. Provide clear, rich, and well-structured responses with bullet points (•) and bold text (**).
2. Never invent or hallucinate facts that are not present in the portfolio data below.
3. Provide relevant clickable links when helpful:
   • [🚀 View Projects](#projects)
   • [🛠️ Jump to Skills](#skills)
   • [📄 View Resume](/resume)
   • [✉️ Contact Form](#contact)

PORTFOLIO DATA & CONTEXT:
${baseContext}`;
}

// Active verified Gemini models in priority order (Fastest sub-300ms first)
const FAST_MODELS = [
  "gemini-2.5-flash",
  "gemini-3-pro-preview",
  "gemini-3-pro",
];

/**
 * Parses and executes actions returned by AI
 */
export function executeAdminAction(rawText, mutators, liveData) {
  if (!mutators) return { executed: false, text: rawText };

  const actionRegex = /\[ACTION:\s*([a-zA-Z0-9_-]+)\]\s*(\{[\s\S]*?\})\s*\[\/ACTION\]/i;
  const match = rawText.match(actionRegex);

  if (!match) {
    return { executed: false, text: rawText };
  }

  const actionName = match[1].trim();
  let args = {};
  try {
    args = JSON.parse(match[2]);
  } catch (e) {
    console.warn("Failed to parse action JSON args:", e);
  }

  let executionSuccess = false;
  let actionSummary = "";

  try {
    switch (actionName) {
      case "updatePersonalInfo": {
        mutators.updatePersonalInfo(args);
        executionSuccess = true;
        actionSummary = "Updated profile information";
        break;
      }
      case "addProject": {
        const added = mutators.addProject(args);
        executionSuccess = true;
        actionSummary = `Added new project "${added?.title || args.title}"`;
        break;
      }
      case "updateProject": {
        const targetProj = (liveData?.projects || []).find(
          (p) =>
            p.id === args.id ||
            p.title?.toLowerCase() === (args.title || args.id || "").toLowerCase()
        );
        if (targetProj) {
          mutators.updateProject(targetProj.id, args);
          executionSuccess = true;
          actionSummary = `Updated project "${targetProj.title}"`;
        }
        break;
      }
      case "deleteProject": {
        const targetProj = (liveData?.projects || []).find(
          (p) =>
            p.id === args.id ||
            p.title?.toLowerCase() === (args.title || args.id || "").toLowerCase()
        );
        if (targetProj) {
          mutators.deleteProject(targetProj.id);
          executionSuccess = true;
          actionSummary = `Deleted project "${targetProj.title}"`;
        }
        break;
      }
      case "addSkillCategory": {
        mutators.addSkillCategory(args);
        executionSuccess = true;
        actionSummary = `Created skill category "${args.title}"`;
        break;
      }
      case "addSkillToCategory": {
        const cat = (liveData?.skills || []).find(
          (s) => s.title?.toLowerCase() === (args.categoryTitle || "").toLowerCase()
        );
        if (cat) {
          const currentItems = Array.isArray(cat.items) ? cat.items : [];
          if (!currentItems.includes(args.skill)) {
            mutators.updateSkillCategory(cat.id, {
              items: [...currentItems, args.skill],
            });
            executionSuccess = true;
            actionSummary = `Added skill "${args.skill}" to "${cat.title}"`;
          }
        }
        break;
      }
      case "deleteSkillCategory": {
        const cat = (liveData?.skills || []).find(
          (s) =>
            s.id === args.id ||
            s.title?.toLowerCase() === (args.title || args.id || "").toLowerCase()
        );
        if (cat) {
          mutators.deleteSkillCategory(cat.id);
          executionSuccess = true;
          actionSummary = `Deleted skill category "${cat.title}"`;
        }
        break;
      }
      case "addCertification": {
        const added = mutators.addCertification(args);
        executionSuccess = true;
        actionSummary = `Added certification "${added?.title || args.title}"`;
        break;
      }
      case "deleteCertification": {
        const cert = (liveData?.certifications || []).find(
          (c) =>
            c.id === args.id ||
            c.title?.toLowerCase() === (args.title || args.id || "").toLowerCase()
        );
        if (cert) {
          mutators.deleteCertification(cert.id);
          executionSuccess = true;
          actionSummary = `Deleted certification "${cert.title}"`;
        }
        break;
      }
      case "addEducation": {
        mutators.addEducation(args);
        executionSuccess = true;
        actionSummary = `Added education at "${args.institution}"`;
        break;
      }
      case "addSocialLink": {
        mutators.addSocialLink(args);
        executionSuccess = true;
        actionSummary = `Added social link "${args.platform}"`;
        break;
      }
      case "exportBackup": {
        mutators.exportDataJSON();
        executionSuccess = true;
        actionSummary = "Triggered portfolio JSON backup download";
        break;
      }
      case "resetDefaults": {
        mutators.resetToDefaults();
        executionSuccess = true;
        actionSummary = "Reset all portfolio data to original defaults";
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Action execution error:", err);
  }

  const cleanedText = rawText.replace(actionRegex, "").trim();

  return {
    executed: executionSuccess,
    action: actionName,
    summary: actionSummary,
    text: cleanedText,
  };
}

/**
 * Intelligent Project Parser: Extracts project details from raw or multi-line user text
 */
export function extractProjectFromText(rawText) {
  const text = rawText.trim();

  // 1. Extract Title
  let title = "";
  const nameMatch =
    text.match(/(?:project\s+(?:which\s+)?name\s+is|project\s+name\s*:|title\s*:|which\s+name\s+is)\s*([^\n.,-]+)/i) ||
    text.match(/(?:add|create)\s+(?:a\s+)?(?:new\s+)?project\s+(?:called\s+|named\s+)?([^\n.,:-]+)/i) ||
    text.match(/name\s*-\s*([^\n.,]+)/i);

  if (nameMatch && nameMatch[1]) {
    title = nameMatch[1].trim().replace(/^["']|["']$/g, "");
  }

  // 2. Extract Technologies
  let technologies = [];
  const techMatch =
    text.match(/(?:technology\s+used|tech\s+used|technologies\s+used|tech\s+stack|technologies)\s*[-:]\s*([^\n]+)/i) ||
    text.match(/(?:with|using)\s+([A-Za-z0-9\s,./&+-]+?)(?:\.|$|\n|duration|link)/i);

  if (techMatch && techMatch[1]) {
    technologies = techMatch[1]
      .split(/[,|&]/)
      .map((t) => t.trim().replace(/^and\s+/i, ""))
      .filter((t) => t.length > 1 && !/^(link|duration|features)/i.test(t));
  }

  // Common tech fallback scanner if none found
  if (technologies.length === 0) {
    const knownTechs = [
      "Next.js", "React", "React.js", "Tailwind CSS", "GSAP", "Java", "Spring Boot", "MySQL",
      "Node.js", "Express", "MongoDB", "Docker", "TypeScript", "JavaScript", "HTML", "CSS",
      "Redux", "GraphQL", "PostgreSQL", "Firebase", "AWS", "Python"
    ];
    for (const kt of knownTechs) {
      const escaped = kt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`\\b${escaped}\\b`, "i").test(text)) {
        technologies.push(kt);
      }
    }
  }

  // Deduplicate and clean tech
  technologies = [...new Set(technologies)];
  if (technologies.length === 0) {
    technologies = ["React", "JavaScript", "Tailwind CSS"];
  }

  // 3. Extract Duration
  let duration = "2025";
  const durationMatch =
    text.match(/(?:duration|project\s+duration|timeline)\s*[-:]\s*([^\n]+)/i) ||
    text.match(/(?:from\s+)?([A-Za-z]+\s+\d{4}\s+(?:to|-)\s+[A-Za-z]+\s+\d{4})/i);
  if (durationMatch && durationMatch[1]) {
    duration = durationMatch[1].trim().replace(/^["']|["']$/g, "");
  }

  // 4. Extract URLs
  let liveUrl = "";
  let githubUrl = "";
  const urlMatches = text.match(/https?:\/\/[^\s"'<>]+/gi) || [];
  for (const u of urlMatches) {
    if (u.includes("github.com")) {
      if (!githubUrl) githubUrl = u;
    } else {
      if (!liveUrl) liveUrl = u;
    }
  }

  // 5. Extract Descriptions & Features
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20 && !/^(technology|tech|duration|link|project duration)/i.test(p));

  const shortDescription =
    paragraphs[0] ||
    text.slice(0, 160).trim() ||
    `Modern full-stack application built with ${technologies.slice(0, 3).join(", ")}.`;

  const fullDescription =
    paragraphs.length > 0 ? paragraphs.join("\n\n") : text;

  // Features
  const features = [];
  const bulletMatches = text.match(/(?:•|\*|-)\s+([^\n]+)/g);
  if (bulletMatches) {
    for (const bm of bulletMatches) {
      const item = bm.replace(/^[•\*\-]\s+/, "").trim();
      if (item && !item.toLowerCase().startsWith("link") && !item.toLowerCase().startsWith("tech")) {
        features.push(item);
      }
    }
  }
  if (features.length === 0) {
    features.push("Fully responsive modern UI architecture");
    features.push("Modular component design and clean state flow");
    features.push(`Integrated ${technologies.slice(0, 2).join(" and ")}`);
  }

  if (!title) {
    title = "New Project";
  }

  return {
    title,
    technologies,
    duration,
    liveUrl,
    githubUrl,
    shortDescription,
    fullDescription,
    features,
    status: "featured",
  };
}

/**
 * Direct Admin Command Parser & Immediate Mutator Execution
 */
export function processDirectAdminCommand(userMessage, mutators, liveData) {
  if (!mutators) return null;

  const msg = userMessage.trim();
  const lower = msg.toLowerCase();

  // 1. Name / Display Name update
  const nameMatch =
    msg.match(/(?:change|update|set|modify)\s+(?:my\s+)?(?:display\s+)?name\s+(?:to|as|:)\s+([^\n.,!]+)/i) ||
    msg.match(/(?:mera\s+naam\s+(?:change\s+karke\s+)?(?:to\s+)?)([^\n.,!]+)(?:\s+kar\s+do|\s+rakh\s+do)/i) ||
    msg.match(/^name\s*:\s*([^\n.,!]+)/i);

  if (nameMatch && nameMatch[1].trim()) {
    const newName = nameMatch[1].trim().replace(/^["']|["']$/g, "");
    mutators.updatePersonalInfo({ name: newName });
    return `✅ **Display Name Updated!**\n\nYour portfolio display name is now **${newName}**.\n\n*This is updated live in your Navbar, Hero greeting ("Hi, I'm ${newName}"), Footer, Resume, and Admin Panel.*`;
  }

  // 2. Add Project (Supports rich descriptions, raw text, and simple commands)
  if (
    lower.startsWith("add project") ||
    lower.startsWith("create project") ||
    lower.includes("add a project") ||
    lower.includes("add new project") ||
    lower.includes("which name is") ||
    lower.includes("project name is") ||
    (lower.includes("technology used") && (lower.includes("project") || lower.includes("link")))
  ) {
    const extracted = extractProjectFromText(msg);
    const added = mutators.addProject(extracted);

    return `✅ **Project "${added.title}" Added Successfully!**\n\n` +
      `• **Title:** ${added.title}\n` +
      `• **Technologies:** ${added.technologies.join(", ")}\n` +
      `• **Duration:** ${added.duration}\n` +
      `• **Live Demo:** ${added.liveUrl ? `[${added.liveUrl}](${added.liveUrl})` : "N/A"}\n` +
      `• **Live Route Slug:** \`/projects/${added.slug}\`\n\n` +
      `*Your project is now published live on your Portfolio Home Page, dynamic Case Study route, and Admin Panel.*`;
  }

  // 3. Delete Project
  if (lower.startsWith("delete project") || lower.startsWith("remove project")) {
    const targetName = msg.replace(/^(?:delete|remove)\s+(?:the\s+)?project\s+/i, "").trim().toLowerCase().replace(/^["']|["']$/g, "");
    const proj = (liveData?.projects || []).find((p) => p.title?.toLowerCase().includes(targetName) || p.id === targetName || p.slug === targetName);
    if (proj) {
      mutators.deleteProject(proj.id);
      return `🗑️ **Project Deleted!**\n\nSuccessfully removed project **"${proj.title}"** from your portfolio and database.`;
    }
  }

  // 4. Bio / Summary update
  const bioMatch =
    msg.match(/(?:change|update|set|modify|edit)\s+(?:my\s+)?(?:bio|about|summary)\s+(?:to|as|:)\s+([\s\S]+)/i) ||
    msg.match(/^(?:bio|about|summary)\s*:\s*([\s\S]+)/i);
  if (bioMatch && bioMatch[1].trim()) {
    const newBio = bioMatch[1].trim().replace(/^["']|["']$/g, "");
    mutators.updatePersonalInfo({ bio: newBio });
    return `✅ **Bio Updated Successfully!**\n\nYour portfolio bio is now set to:\n\n> "${newBio}"\n\n*The changes are live across the site and saved in your Admin Panel.*`;
  }

  // 5. Pitch / Tagline / Short Bio update
  const pitchMatch = msg.match(/(?:change|update|set|modify|edit)\s+(?:my\s+)?(?:pitch|headline|tagline|short\s+bio)\s+(?:to|as|:)\s+([\s\S]+)/i);
  if (pitchMatch && pitchMatch[1].trim()) {
    const newPitch = pitchMatch[1].trim().replace(/^["']|["']$/g, "");
    mutators.updatePersonalInfo({ shortBio: newPitch });
    return `✅ **Hero Pitch Updated!**\n\nYour hero tagline is now:\n\n**"${newPitch}"**`;
  }

  // 6. Email update
  const emailMatch =
    msg.match(/(?:change|update|set|modify)\s+(?:my\s+)?email\s+(?:to|as|:)?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i) ||
    msg.match(/(?:email)\s*:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (emailMatch && emailMatch[1]) {
    const email = emailMatch[1].trim();
    mutators.updatePersonalInfo({ email });
    return `✅ **Email Address Updated!**\n\nContact email is now set to \`${email}\`.`;
  }

  // 7. Phone update
  const phoneMatch = msg.match(/(?:change|update|set|modify)\s+(?:my\s+)?phone(?:\s+number)?\s+(?:to|as|:)?\s*([+0-9\s()-]{7,})/i);
  if (phoneMatch && phoneMatch[1].trim()) {
    const phone = phoneMatch[1].trim();
    mutators.updatePersonalInfo({ phone });
    return `✅ **Phone Number Updated!**\n\nContact phone is now set to \`${phone}\`.`;
  }

  // 8. Location update
  const locMatch = msg.match(/(?:change|update|set|modify)\s+(?:my\s+)?location\s+(?:to|as|:)\s+([^\n.]+)/i);
  if (locMatch && locMatch[1].trim()) {
    const location = locMatch[1].trim();
    mutators.updatePersonalInfo({ location });
    return `✅ **Location Updated!**\n\nYour location is now set to **${location}**.`;
  }

  // 9. Title / Role update
  const titleMatch = msg.match(/(?:change|update|set|modify)\s+(?:my\s+)?(?:title|role)\s+(?:to|as|:)\s+([^\n.]+)/i);
  if (titleMatch && titleMatch[1].trim()) {
    const newTitle = titleMatch[1].trim();
    const currentTitles = Array.isArray(liveData?.personalInfo?.titles) ? liveData.personalInfo.titles : ["Java Developer"];
    mutators.updatePersonalInfo({ titles: [newTitle, ...currentTitles.filter((t) => t !== newTitle).slice(0, 2)] });
    return `✅ **Role Title Updated!**\n\nPrimary role is now set to **${newTitle}**.`;
  }

  // 10. Add Skill to category
  if (lower.startsWith("add skill") || lower.includes("add skill")) {
    const match =
      msg.match(/add\s+skill\s+([^to\n]+)\s+(?:to|in)\s+(.+)/i) ||
      msg.match(/add\s+([^to\n]+)\s+(?:to\s+(?:skills|category))\s+(.+)/i);
    if (match) {
      const skillName = match[1].trim().replace(/^["']|["']$/g, "");
      const catName = match[2].trim().toLowerCase();
      const cat = (liveData?.skills || []).find((s) => s.title?.toLowerCase().includes(catName));
      if (cat) {
        const currentItems = Array.isArray(cat.items) ? cat.items : [];
        if (!currentItems.includes(skillName)) {
          mutators.updateSkillCategory(cat.id, { items: [...currentItems, skillName] });
          return `✅ **Skill Added!**\n\nAdded **${skillName}** to your **${cat.title}** category.`;
        }
        return `ℹ️ Skill **${skillName}** is already present in **${cat.title}**.`;
      }
    }
  }

  // 11. Delete Skill
  if (lower.startsWith("delete skill") || lower.startsWith("remove skill")) {
    const match = msg.match(/(?:delete|remove)\s+skill\s+([^from\n]+)\s+from\s+(.+)/i);
    if (match) {
      const skillName = match[1].trim().toLowerCase();
      const catName = match[2].trim().toLowerCase();
      const cat = (liveData?.skills || []).find((s) => s.title?.toLowerCase().includes(catName));
      if (cat) {
        const updatedItems = (cat.items || []).filter((i) => i.toLowerCase() !== skillName);
        mutators.updateSkillCategory(cat.id, { items: updatedItems });
        return `🗑️ **Skill Removed!**\n\nRemoved skill **${match[1].trim()}** from **${cat.title}**.`;
      }
    }
  }

  // 12. Add Certification
  if (lower.startsWith("add certification") || lower.startsWith("add cert")) {
    const certText = msg.replace(/^(?:add\s+certification|add\s+cert)\s+/i, "").trim();
    const title = certText.split(/(?:\s+from\s+|\s+by\s+|\s+-\s+)/i)[0].trim();
    const orgMatch = certText.match(/(?:from|by)\s+([^.\n]+)/i);
    const org = orgMatch ? orgMatch[1].trim() : "Accredited Organization";

    const added = mutators.addCertification({
      title: title || "New Certification",
      organization: org,
      date: "2025",
      skillsLearned: ["Core Competency", "Practical Architecture"],
    });

    return `✅ **Certification Added!**\n\n• **Title:** ${added.title}\n• **Organization:** ${added.organization}\n• **Route:** \`/certifications/${added.slug}\``;
  }

  // 13. Delete Certification
  if (lower.startsWith("delete certification") || lower.startsWith("remove certification") || lower.startsWith("delete cert")) {
    const target = msg.replace(/^(?:delete|remove)\s+(?:certification|cert)\s+/i, "").trim().toLowerCase();
    const cert = (liveData?.certifications || []).find((c) => c.title?.toLowerCase().includes(target) || c.id === target);
    if (cert) {
      mutators.deleteCertification(cert.id);
      return `🗑️ **Certification Deleted!**\n\nSuccessfully removed **"${cert.title}"** from your certifications.`;
    }
  }

  // 14. Export Backup
  if (lower.includes("export backup") || lower.includes("download backup") || lower.includes("export json") || lower.includes("backup data")) {
    mutators.exportDataJSON();
    return `📦 **Backup Triggered!**\n\nYour complete portfolio data JSON file is downloading now.`;
  }

  // 15. Reset Defaults
  if (lower.includes("reset to defaults") || lower.includes("reset all data") || lower.includes("restore defaults")) {
    mutators.resetToDefaults();
    return `🔄 **Reset Completed!**\n\nAll portfolio data, skills, projects, and bio have been restored to default repository code values.`;
  }

  return null;
}

/**
 * Intelligent Smart Knowledge Responder (Used if offline or as instant resolver)
 */
export function generateSmartOfflineResponse(
  userMessage,
  liveData = null,
  isAdminMode = false,
  mutators = null
) {
  const msg = userMessage.trim();
  const lower = msg.toLowerCase();
  const info = liveData?.personalInfo || defaultPersonalInfo;

  // 1. Direct Commands (Runs immediately whenever mutators are passed)
  if (mutators) {
    const directResult = processDirectAdminCommand(userMessage, mutators, liveData);
    if (directResult) return directResult;
  }

  // 2. Common General Tech & CS Questions
  if (lower.includes("what is github") || lower.includes("what is git hub") || lower === "github" || lower.includes("explain github")) {
    return `**GitHub** is a cloud-based hosting platform for software development and version control using **Git**.\n\n• **Core Features:** Code repositories, pull requests, issue tracking, CI/CD with GitHub Actions, and collaborative code reviews.\n• **Khustar's GitHub Profile:** [github.com/khustar04](${info.github || "https://github.com/khustar04"})`;
  }

  if (lower.includes("what is git") && !lower.includes("github")) {
    return `**Git** is a distributed version control system (DVCS) designed to track changes in source code during software development, enabling branching, merging, and collaboration across teams.`;
  }

  if (lower.includes("what is spring boot") || lower.includes("spring boot")) {
    return `**Spring Boot** is an open-source Java-based framework used to build stand-alone, production-grade microservices and web APIs with auto-configuration, embedded servers (Tomcat/Jetty), and dependency injection.\n\nKhustar uses Spring Boot 3.3 for building RESTful backends like **Streakify**.`;
  }

  if (lower.includes("what is java") || lower === "java") {
    return `**Java** is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible ("Write Once, Run Anywhere"). It is Khustar's primary language for backend architecture and API development.`;
  }

  if (lower.includes("what is streakify") || lower.includes("tell me about streakify")) {
    return `**Streakify** is Khustar's featured full-stack coding platform:\n\n• **Purpose:** Gamified Data Structures & Algorithms tracker with 365-day heatmaps, custom problem roadmaps, and friend leaderboards.\n• **Tech Stack:** Spring Boot 3.3, Java, JWT auth, MySQL 8.0, React 18, Vite, Recharts, REST API.\n\n[📦 View Streakify Details](/projects/streakify)`;
  }

  if (lower.includes("what is brightpath") || lower.includes("tell me about brightpath") || lower.includes("bright path")) {
    return `**BrightPath** is an interactive e-learning platform:\n\n• **Purpose:** Guides Class 11th, 12th, and college students with structured materials, career roadmaps, and an AI study assistant.\n• **Tech Stack:** Next.js (React), Tailwind CSS, JavaScript, HTML5, GSAP timeline animations.\n• **Live Demo:** [bright-path-peach.vercel.app](https://bright-path-peach.vercel.app/)\n\n[📦 View BrightPath Details](/projects/brightpath)`;
  }

  if (lower.includes("skills") || lower.includes("tech stack") || lower.includes("technologies")) {
    const skillCategories = (liveData?.skills || defaultSkills).map((s) => `• **${s.title}:** ${(s.items || []).join(", ")}`).join("\n");
    return `Here are **${info.name}**'s core technical skills:\n\n${skillCategories}\n\n[🛠️ View Skills Section](#skills)`;
  }

  if (lower.includes("contact") || lower.includes("email") || lower.includes("phone") || lower.includes("reach")) {
    return `You can get in touch with **${info.name}** via:\n\n• **Email:** [${info.email}](mailto:${info.email})\n• **Phone:** ${info.phone || "Available on request"}\n• **LinkedIn:** [${info.linkedin}](${info.linkedin})\n• **GitHub:** [${info.github}](${info.github})\n\n[✉️ Open Contact Form](#contact)`;
  }

  if (lower.includes("resume") || lower.includes("cv")) {
    return `You can view and download **${info.name}**'s full printable resume here:\n\n[📄 View Full Resume Page](/resume)`;
  }

  if (lower.includes("education") || lower.includes("college") || lower.includes("degree") || lower.includes("university")) {
    const eduItems = (liveData?.education || defaultEducation).map((e) => `• **${e.degree} in ${e.field}:** ${e.institution} (${e.duration})`).join("\n");
    return `**Academic Background:**\n\n${eduItems}\n\n[🎓 View Education Timeline](#education)`;
  }

  if (lower.includes("who is khustar") || lower.includes("about khustar") || lower.includes("tell me about khustar") || lower.includes("about him")) {
    const titlesStr = Array.isArray(info.titles) ? info.titles.join(" & ") : info.titles || "Java Developer";
    return `**${info.name}** is a **${titlesStr}** based in ${info.location || "Bhopal"}.\n\n${info.bio || info.shortBio || ""}\n\n• [🚀 View Projects](#projects)\n• [📄 View Resume](/resume)\n• [✉️ Contact Form](#contact)`;
  }

  // General fallback (Strictly Portfolio Focused)
  return `I am **${info.name}**'s dedicated Portfolio AI Assistant. I am specialized in answering questions about Khustar's background, core backend skills (**Java, Spring Boot, REST APIs, MySQL**), and featured projects (**Streakify, BrightPath**).\n\nFeel free to explore:\n• [🚀 View Projects](#projects)\n• [🛠️ Jump to Skills](#skills)\n• [📄 View Resume](/resume)\n• [✉️ Contact Form](#contact)`;
}

/**
 * Stream responses in real-time with Admin Command interceptor and Gemini API support
 */
export async function streamGeminiResponse(
  userMessage,
  messageHistory = [],
  onChunk,
  isAdminMode = false,
  liveData = null,
  mutators = null
) {
  // 1. Check and execute direct command immediately
  if (mutators) {
    const directExecution = processDirectAdminCommand(userMessage, mutators, liveData);
    if (directExecution) {
      if (onChunk) onChunk(directExecution);
      return directExecution;
    }
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const systemInstruction = getSystemPrompt(isAdminMode, liveData);
  const contents = buildGeminiContents(messageHistory, userMessage);

  if (apiKey && apiKey.trim() !== "") {
    for (const model of FAST_MODELS) {
      let accumulatedText = "";
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey.trim()}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemInstruction }] },
              contents,
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (!response.ok) {
          continue;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr || jsonStr === "[DONE]") continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const textChunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textChunk) {
                  accumulatedText += textChunk;
                  if (onChunk) {
                    const cleanPreview = accumulatedText
                      .replace(/\[ACTION:[\s\S]*?\][\s\S]*?\[\/ACTION\]/gi, "⚡ *Executing command...*")
                      .trim();
                    onChunk(cleanPreview || accumulatedText);
                  }
                }
              } catch {
                // Ignore stream partial JSON chunks
              }
            }
          }
        }

        if (accumulatedText.trim().length > 0) {
          if (isAdminMode && mutators) {
            const actionResult = executeAdminAction(accumulatedText, mutators, liveData);
            if (actionResult.executed) {
              const finalConfirm = `${actionResult.text}\n\n✅ *Live Change Applied:* **${actionResult.summary}**`;
              if (onChunk) onChunk(finalConfirm);
              return finalConfirm;
            }
          }
          return accumulatedText;
        }
      } catch (err) {
        console.warn(`Streaming attempt for ${model} failed:`, err.message);
      }
    }

    // Single-call attempt
    try {
      const fallback = await callGeminiAPI(userMessage, messageHistory, isAdminMode, liveData);
      if (fallback && fallback.trim()) {
        if (isAdminMode && mutators) {
          const actionResult = executeAdminAction(fallback, mutators, liveData);
          if (actionResult.executed) {
            const finalConfirm = `${actionResult.text}\n\n✅ *Live Change Applied:* **${actionResult.summary}**`;
            if (onChunk) onChunk(finalConfirm);
            return finalConfirm;
          }
        }
        if (onChunk) onChunk(fallback);
        return fallback;
      }
    } catch (e) {
      console.warn("Single-call Gemini API also failed, using Smart Knowledge Engine:", e.message);
    }
  }

  // Intelligent Smart Offline Knowledge Engine
  const smartAnswer = generateSmartOfflineResponse(userMessage, liveData, isAdminMode, mutators);
  if (onChunk) onChunk(smartAnswer);
  return smartAnswer;
}

/**
 * Standard single-call fallback
 */
export async function callGeminiAPI(
  userMessage,
  messageHistory = [],
  isAdminMode = false,
  liveData = null
) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") throw new Error("NO_API_KEY");

  const systemInstruction = getSystemPrompt(isAdminMode, liveData);
  const contents = buildGeminiContents(messageHistory, userMessage);

  for (const model of FAST_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) continue;

      const data = await response.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (answer && answer.trim()) return answer;
    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message);
    }
  }

  throw new Error("Unable to connect to Gemini API.");
}

export const suggestedQuestions = [
  "Tell me about Khustar Hussain",
  "Tell me about the Streakify project",
  "Tell me about the BrightPath project",
  "What are his core Java & backend skills?",
  "Where can I download his Resume?",
  "How can I contact Khustar?",
];

export const adminSuggestedQuestions = [
  "Change display name to Khustar Hussain",
  "Add a project with details & link",
  "Update my bio to Senior Java Developer",
  "Add skill Docker to Tools & Platforms",
  "Export portfolio data backup",
];
