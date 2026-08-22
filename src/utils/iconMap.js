import {
  Code,
  Code2,
  Server,
  TestTube,
  Layout,
  Database,
  Wrench,
  BookOpen,
  Cpu,
  Globe,
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck,
  Smartphone,
  Cloud,
  FolderGit2,
  Mail,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/icons";

export const SKILL_ICON_MAP = {
  Code,
  Code2,
  Server,
  TestTube,
  Layout,
  Database,
  Wrench,
  BookOpen,
  Cpu,
  Globe,
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck,
  Smartphone,
  Cloud,
  FolderGit2,
};

export function resolveSkillIcon(skill) {
  if (!skill) return Code2;

  // 1. If it's a valid component function or class
  if (typeof skill.icon === "function") {
    return skill.icon;
  }

  // 2. If it's a forwardRef / memo component object (with $$typeof)
  if (typeof skill.icon === "object" && skill.icon !== null && skill.icon.$$typeof) {
    return skill.icon;
  }

  // 3. If icon is a valid string key in SKILL_ICON_MAP
  if (typeof skill.icon === "string" && SKILL_ICON_MAP[skill.icon]) {
    return SKILL_ICON_MAP[skill.icon];
  }
  if (typeof skill.iconName === "string" && SKILL_ICON_MAP[skill.iconName]) {
    return SKILL_ICON_MAP[skill.iconName];
  }

  // 4. Keyword matching based on ID or Title
  const key = ((skill.id || "") + " " + (skill.title || "")).toLowerCase();
  if (key.includes("java") || key.includes("code") || key.includes("program")) return Code;
  if (key.includes("backend") || key.includes("server") || key.includes("api") || key.includes("spring")) return Server;
  if (key.includes("test") || key.includes("qa") || key.includes("junit") || key.includes("mock")) return TestTube;
  if (key.includes("front") || key.includes("ui") || key.includes("react") || key.includes("layout") || key.includes("html") || key.includes("css")) return Layout;
  if (key.includes("data") || key.includes("sql") || key.includes("db") || key.includes("mysql") || key.includes("postgres")) return Database;
  if (key.includes("tool") || key.includes("devops") || key.includes("git") || key.includes("platform")) return Wrench;
  if (key.includes("concept") || key.includes("book") || key.includes("dsa") || key.includes("algo") || key.includes("theory")) return BookOpen;
  if (key.includes("cloud") || key.includes("aws") || key.includes("azure")) return Cloud;

  return Code2;
}

export function resolveSocialIcon(link) {
  if (!link) return Globe;

  if (typeof link.icon === "function") {
    return link.icon;
  }
  if (typeof link.icon === "object" && link.icon !== null && link.icon.$$typeof) {
    return link.icon;
  }

  const name = ((link.platform || "") + " " + (link.name || "") + " " + (link.id || "")).toLowerCase();
  const url = (link.url || "").toLowerCase();

  if (name.includes("github") || url.includes("github.com")) return GithubIcon;
  if (name.includes("linkedin") || url.includes("linkedin.com")) return LinkedinIcon;
  if (name.includes("mail") || name.includes("email") || url.includes("mailto:")) return Mail;

  return Globe;
}
