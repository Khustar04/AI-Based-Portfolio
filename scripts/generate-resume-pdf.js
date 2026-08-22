import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

const doc = new jsPDF({
  orientation: "portrait",
  unit: "pt",
  format: "a4",
});

const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
const margin = 40;
const contentWidth = pageWidth - margin * 2;
let y = 45;

function checkPage(needed = 20) {
  if (y + needed > 800) {
    doc.addPage();
    y = 45;
  }
}

// ---------------- HEADER ----------------
doc.setFont("helvetica", "bold");
doc.setFontSize(20);
doc.setTextColor(15, 23, 42); // #0f172a
doc.text("KHUSTAR HUSSAIN", pageWidth / 2, y, { align: "center" });

y += 18;
doc.setFont("helvetica", "bold");
doc.setFontSize(11);
doc.setTextColor(37, 99, 235); // #2563eb
doc.text("Java Developer | Backend Developer (Spring Boot)", pageWidth / 2, y, { align: "center" });

y += 15;
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.setTextColor(71, 85, 105); // #475569
const contactLine = "Siwan, Bihar  |  +91-9234957966  |  khustarhussain8@gmail.com  |  github.com/khustar04  |  linkedin.com/in/khustarhussain04/";
doc.text(contactLine, pageWidth / 2, y, { align: "center" });

y += 12;

function drawSectionHeading(title) {
  checkPage(30);
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), margin, y);
  y += 4;
  doc.setDrawColor(203, 213, 225); // #cbd5e1
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;
}

// ---------------- SUMMARY ----------------
drawSectionHeading("Summary");
doc.setFont("helvetica", "normal");
doc.setFontSize(9.5);
doc.setTextColor(51, 65, 85);
const summaryText = "Recent B.Tech graduate (AI & ML) with hands-on backend development experience in Java, Spring Boot, and Spring Security, plus front-end experience in React.js. Built two full-stack projects — including a production-grade DSA tracking platform with OAuth, JWT, and email verification — with role-based access control and RESTful APIs across multiple endpoints. Strong foundation in data structures, algorithms, and relational database design, actively seeking a Java Developer role to apply and grow these skills in a production environment.";
const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
doc.text(summaryLines, margin, y, { lineHeightFactor: 1.25 });
y += summaryLines.length * 12 + 4;

// ---------------- SKILLS ----------------
drawSectionHeading("Skills");
const skillsData = [
  { label: "Core Java:", desc: "OOPs, Collections, Multithreading, Exception Handling" },
  { label: "Backend Frameworks:", desc: "Spring Boot, Spring MVC, Spring Security, J2EE, Hibernate ORM, REST APIs, JWT, OAuth 2.0, Maven" },
  { label: "Testing:", desc: "JUnit, Mockito" },
  { label: "Frontend:", desc: "HTML, CSS, JavaScript, React.js, Tailwind CSS, Recharts" },
  { label: "Database:", desc: "SQL, RDBMS, MySQL, PostgreSQL" },
  { label: "Tools & Platforms:", desc: "IntelliJ IDEA, VS Code, Spring Tool Suite, Postman, Git, GitHub" },
  { label: "Core Concepts:", desc: "Object-Oriented Programming, DBMS, Computer Networks" },
];

skillsData.forEach((s) => {
  checkPage(16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(s.label, margin, y);
  
  const labelWidth = doc.getTextWidth(s.label) + 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(s.desc, contentWidth - labelWidth);
  doc.text(descLines, margin + labelWidth, y);
  y += Math.max(1, descLines.length) * 12 + 2;
});

// ---------------- PROJECTS ----------------
drawSectionHeading("Projects");

// Project 1: Streakify
checkPage(30);
doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.setTextColor(15, 23, 42);
doc.text("Streakify — Gamified DSA Tracking Platform", margin, y);

const streakifyTech = "Java, Spring Boot, Spring Security, JWT, MySQL, React 18, Vite, Recharts, REST API";
const p1TechLines = doc.splitTextToSize(streakifyTech, contentWidth - 250);
doc.setFont("helvetica", "italic");
doc.setFontSize(8.5);
doc.setTextColor(71, 85, 105);
doc.text(streakifyTech, pageWidth - margin, y, { align: "right" });
y += 13;

const p1Bullets = [
  "Built a full-stack DSA revision platform with a stateless Spring Boot 3.3 REST backend (8 controllers) and a React 18 + Vite SPA frontend.",
  "Implemented multi-provider authentication: email/password sign-up with BCrypt hashing, Google OAuth 2.0 sign-in, and email OTP verification via SMTP.",
  "Designed a custom JWT authentication filter using JJWT (HMAC-SHA512) with 24-hour access tokens and 7-day refresh tokens, integrated with Spring Security's stateless SecurityContextHolder.",
  "Modeled 11 entities and repositories using Spring Data JPA/Hibernate across a normalized MySQL 8.0 schema (11 tables) covering users, custom sheets, problem notes, badges, friendships, and daily activity.",
  "Built a custom sheet engine and curated A2Z problem tracker with per-problem complexity notes, alongside a gamification system with streaks, badges, and a 365-day activity heatmap.",
  "Engineered a friend-graph leaderboard with multi-metric sorting, and hardened the API with centralized exception handling, file-upload validation, and object-level access control."
];

p1Bullets.forEach((bullet) => {
  checkPage(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text("•", margin + 4, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const lines = doc.splitTextToSize(bullet, contentWidth - 16);
  doc.text(lines, margin + 14, y, { lineHeightFactor: 1.2 });
  y += lines.length * 10.5 + 2.5;
});

y += 4;

// Project 2: AI Job Finder
checkPage(30);
doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.setTextColor(15, 23, 42);
doc.text("AI-Powered Resume-Based Job Finder", margin, y);

const p2Tech = "React.js, Gemini API, Adzuna API, Apache Tika, JSON";
doc.setFont("helvetica", "italic");
doc.setFontSize(8.5);
doc.setTextColor(71, 85, 105);
doc.text(p2Tech, pageWidth - margin, y, { align: "right" });
y += 13;

const p2Bullets = [
  "Built an AI-enabled resume analysis module to extract skills, experience level, and target roles from uploaded resumes (PDF/DOC), parsed using Apache Tika.",
  "Integrated external job-listing APIs to fetch and filter relevant openings based on user profile match.",
  "Developed a ranking engine to score and sort job listings by skill fit, relevance, and recency.",
  "Built a dashboard displaying resume score, missing skills, and AI-generated improvement suggestions with date-based sorting for new postings."
];

p2Bullets.forEach((bullet) => {
  checkPage(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text("•", margin + 4, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const lines = doc.splitTextToSize(bullet, contentWidth - 16);
  doc.text(lines, margin + 14, y, { lineHeightFactor: 1.2 });
  y += lines.length * 10.5 + 2.5;
});

// ---------------- CERTIFICATIONS ----------------
drawSectionHeading("Certifications");
const certsList = [
  "HackerRank Certified — Java (Basic) (2025)",
  "HackerRank Certified — Software Engineer (2025)",
  "AWS Academy Graduate — AWS Academy Cloud Foundations (2025)",
  "HackerRank Certified — JavaScript (Intermediate) (2025)",
];

certsList.forEach((c) => {
  checkPage(14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text("•", margin + 4, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(c, margin + 14, y);
  y += 12;
});

// ---------------- EDUCATION ----------------
drawSectionHeading("Education");

checkPage(28);
doc.setFont("helvetica", "bold");
doc.setFontSize(9.5);
doc.setTextColor(15, 23, 42);
doc.text("Technocrats Institute of Technology Excellence", margin, y);
doc.setFont("helvetica", "normal");
doc.setFontSize(8.5);
doc.setTextColor(71, 85, 105);
doc.text("June 2022 – June 2026", pageWidth - margin, y, { align: "right" });
y += 11;

doc.setFont("helvetica", "italic");
doc.setFontSize(8.5);
doc.setTextColor(51, 65, 85);
doc.text("B.Tech, Artificial Intelligence & Machine Learning | Bhopal, Madhya Pradesh", margin, y);
y += 14;

checkPage(28);
doc.setFont("helvetica", "bold");
doc.setFontSize(9.5);
doc.setTextColor(15, 23, 42);
doc.text("Z.A. Islamia College", margin, y);
doc.setFont("helvetica", "normal");
doc.setFontSize(8.5);
doc.setTextColor(71, 85, 105);
doc.text("Feb 2020 – Feb 2022", pageWidth - margin, y, { align: "right" });
y += 11;

doc.setFont("helvetica", "italic");
doc.setFontSize(8.5);
doc.setTextColor(51, 65, 85);
doc.text("Science – Intermediate | Siwan, Bihar", margin, y);
y += 14;

// Output PDF buffer
const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

const targetDir = path.resolve("public");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, "Khustar_Hussain_Resume.pdf"), pdfBuffer);
fs.writeFileSync(path.join(targetDir, "resume.pdf"), pdfBuffer);

console.log("✅ Successfully generated Khustar_Hussain_Resume.pdf and resume.pdf in public/");
