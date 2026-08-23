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
  Phone,
  Send,
  MessageSquare,
} from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  FacebookIcon,
  TelegramIcon,
  RedditIcon,
  MediumIcon,
  TwitterXIcon,
  YouTubeIcon,
  DiscordIcon,
  LeetCodeIcon,
  HackerRankIcon,
} from "../components/icons";

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

export const SOCIAL_ICON_OPTIONS = [
  { id: "github", label: "GitHub", icon: GithubIcon, defaultBaseUrl: "https://github.com/" },
  { id: "linkedin", label: "LinkedIn", icon: LinkedinIcon, defaultBaseUrl: "https://linkedin.com/in/" },
  { id: "instagram", label: "Instagram", icon: InstagramIcon, defaultBaseUrl: "https://instagram.com/" },
  { id: "facebook", label: "Facebook", icon: FacebookIcon, defaultBaseUrl: "https://facebook.com/" },
  { id: "telegram", label: "Telegram", icon: TelegramIcon, defaultBaseUrl: "https://t.me/" },
  { id: "reddit", label: "Reddit", icon: RedditIcon, defaultBaseUrl: "https://reddit.com/user/" },
  { id: "medium", label: "Medium", icon: MediumIcon, defaultBaseUrl: "https://medium.com/@" },
  { id: "twitter", label: "Twitter / X", icon: TwitterXIcon, defaultBaseUrl: "https://x.com/" },
  { id: "youtube", label: "YouTube", icon: YouTubeIcon, defaultBaseUrl: "https://youtube.com/@" },
  { id: "discord", label: "Discord", icon: DiscordIcon, defaultBaseUrl: "https://discord.gg/" },
  { id: "leetcode", label: "LeetCode", icon: LeetCodeIcon, defaultBaseUrl: "https://leetcode.com/" },
  { id: "hackerrank", label: "HackerRank", icon: HackerRankIcon, defaultBaseUrl: "https://hackerrank.com/" },
  { id: "mail", label: "Email", icon: Mail, defaultBaseUrl: "mailto:" },
  { id: "website", label: "Website / Portfolio", icon: Globe, defaultBaseUrl: "https://" },
];

export const SOCIAL_ICON_MAP = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  telegram: TelegramIcon,
  reddit: RedditIcon,
  medium: MediumIcon,
  twitter: TwitterXIcon,
  x: TwitterXIcon,
  youtube: YouTubeIcon,
  discord: DiscordIcon,
  leetcode: LeetCodeIcon,
  hackerrank: HackerRankIcon,
  mail: Mail,
  email: Mail,
  phone: Phone,
  website: Globe,
  globe: Globe,
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

  const iconName = (link.iconName || link.icon || "").toLowerCase();
  if (iconName && SOCIAL_ICON_MAP[iconName]) {
    return SOCIAL_ICON_MAP[iconName];
  }

  const platform = ((link.platform || "") + " " + (link.name || "") + " " + (link.id || "")).toLowerCase();
  const url = (link.url || "").toLowerCase();

  if (platform.includes("github") || url.includes("github.com")) return GithubIcon;
  if (platform.includes("linkedin") || url.includes("linkedin.com")) return LinkedinIcon;
  if (platform.includes("instagram") || url.includes("instagram.com")) return InstagramIcon;
  if (platform.includes("facebook") || url.includes("facebook.com") || url.includes("fb.me")) return FacebookIcon;
  if (platform.includes("telegram") || url.includes("t.me") || url.includes("telegram.me")) return TelegramIcon;
  if (platform.includes("reddit") || url.includes("reddit.com")) return RedditIcon;
  if (platform.includes("medium") || url.includes("medium.com")) return MediumIcon;
  if (platform.includes("twitter") || platform.includes("x.com") || url.includes("twitter.com") || url.includes("x.com")) return TwitterXIcon;
  if (platform.includes("youtube") || url.includes("youtube.com") || url.includes("youtu.be")) return YouTubeIcon;
  if (platform.includes("discord") || url.includes("discord.gg") || url.includes("discord.com")) return DiscordIcon;
  if (platform.includes("leetcode") || url.includes("leetcode.com")) return LeetCodeIcon;
  if (platform.includes("hackerrank") || url.includes("hackerrank.com")) return HackerRankIcon;
  if (platform.includes("mail") || platform.includes("email") || url.includes("mailto:")) return Mail;
  if (platform.includes("phone") || url.includes("tel:")) return Phone;

  return Globe;
}
