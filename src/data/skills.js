import {
  Code,
  Server,
  TestTube,
  Layout,
  Database,
  Wrench,
  BookOpen,
} from "lucide-react";

export const skills = [
  {
    id: "core-java",
    title: "Core Java",
    icon: Code,
    items: [
      "OOPs",
      "Collections Framework",
      "Multithreading",
      "Exception Handling",
    ],
  },
  {
    id: "backend",
    title: "Backend Frameworks",
    icon: Server,
    items: [
      "Spring Boot",
      "Spring MVC",
      "Spring Security",
      "Hibernate ORM",
      "REST APIs",
      "JWT",
      "OAuth 2.0",
      "J2EE",
      "Maven",
    ],
  },
  {
    id: "testing",
    title: "Testing",
    icon: TestTube,
    items: [
      "JUnit",
      "Mockito",
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    icon: Layout,
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "React.js",
      "Tailwind CSS",
      "Recharts",
    ],
  },
  {
    id: "database",
    title: "Database",
    icon: Database,
    items: [
      "SQL",
      "RDBMS",
      "MySQL",
      "PostgreSQL",
    ],
  },
  {
    id: "tools",
    title: "Tools & Platforms",
    icon: Wrench,
    items: [
      "IntelliJ IDEA",
      "VS Code",
      "Spring Tool Suite",
      "Postman",
      "Git",
      "GitHub",
    ],
  },
  {
    id: "core-concepts",
    title: "Core Concepts",
    icon: BookOpen,
    items: [
      "Object-Oriented Programming",
      "DBMS",
      "Computer Networks",
      "Data Structures & Algorithms",
    ],
  },
];
