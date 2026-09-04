export const projects = [
  {
    id: "streakify",
    slug: "streakify",
    title: "Streakify — Gamified DSA Tracking Platform",
    shortDescription:
      "A full-stack DSA revision platform with stateless Spring Boot 3.3 REST backend (8 controllers), React 18 + Vite SPA, OAuth 2.0, JWT, and 365-day activity gamification.",
    fullDescription:
      "Streakify is a production-grade, full-stack Data Structures & Algorithms revision and tracking platform. It combines a high-performance stateless Spring Boot 3.3 REST API with a modern React 18 + Vite frontend, supporting multi-provider authentication (Google OAuth 2.0, BCrypt email/password, and SMTP OTP verification), custom JWT security filters, 11 JPA/Hibernate entities across MySQL 8.0, custom problem sheets, streaks, badges, and interactive leaderboards.",
    problemStatement:
      "Students and developers preparing for technical interviews lack a structured, gamified platform to track daily DSA problem-solving progress, maintain revision complexity notes, and compete with peers with verifiable activity metrics.",
    solution:
      "Engineered an end-to-end full-stack platform featuring custom problem sheets, an A2Z DSA sheet tracker with complexity notes, a 365-day activity heatmap, a friend-graph leaderboard with multi-metric sorting, and hardened security filters with centralized exception handling.",
    image: "/projects/streakify.svg",
    duration: "Jan 2025 – Feb 2025",
    technologies: [
      "Java",
      "Spring Boot 3.3",
      "Spring Security",
      "JWT (HMAC-SHA512)",
      "MySQL 8.0",
      "Hibernate / JPA",
      "React 18",
      "Vite",
      "Tailwind CSS",
      "Recharts",
      "OAuth 2.0",
      "REST API",
    ],
    features: [
      "Stateless Spring Boot 3.3 REST backend with 8 modular controllers",
      "Multi-provider authentication: Email/Password (BCrypt), Google OAuth 2.0, and SMTP OTP verification",
      "Custom JWT authentication filter using JJWT (HMAC-SHA512) with 24h access & 7-day refresh tokens",
      "11 Entities & Repositories across a normalized MySQL 8.0 schema (users, sheets, notes, badges, activity)",
      "Custom sheet engine & curated A2Z problem tracker with per-problem complexity notes",
      "Gamification system featuring streaks, achievement badges, and 365-day activity heatmap with Recharts",
      "Friend-graph leaderboard with multi-metric sorting & object-level access control",
    ],
    technicalImplementation:
      "Backend engineered with Spring Boot 3.3 and Spring Data JPA over MySQL 8.0. Authentication handled via stateless Spring Security with SecurityContextHolder integration and JJWT HMAC-SHA512 token management. Frontend built as a lightning-fast React 18 + Vite single-page application styled with Tailwind CSS and interactive Recharts data visualization.",
    challenges:
      "Architecting stateless token rotation with dual access/refresh tokens alongside multi-provider authentication (Google OAuth2 + SMTP OTP), while optimizing entity relationships across 11 relational tables for high-throughput leaderboard queries.",
    keyLearnings:
      "Mastered Spring Security filter chain internals, token-based authentication lifecycle, advanced Spring Data JPA repository modeling, database normalization, and frontend state management with Recharts visual heatmaps.",
    githubUrl: "https://github.com/khustar04",
    liveUrl: "",
    status: "featured",
  },
  {
    id: "brightpath",
    slug: "brightpath",
    title: "BrightPath — Modern E-Learning & Career Platform",
    shortDescription:
      "A fully responsive, modern e-learning platform built with Next.js, React, Tailwind CSS, and GSAP animations featuring structured academic roadmaps and smart onboarding.",
    fullDescription:
      "BrightPath is a fully responsive, modern e-learning front-end platform developed using Next.js (React), Tailwind CSS, and GSAP animations. The platform is designed to guide students from Class 11th, 12th, Graduation, and Post-Graduation levels by offering structured learning materials, comprehensive career roadmaps, and a personalized study assistant. The key highlight of this project is its smart onboarding flow — first-time users are shown an engaging intro about the platform before being prompted to log in or sign up. Based on authentication, users gain access to different sections like Courses, Career Roadmaps, Question Bank, AI Assistant, and more.",
    problemStatement:
      "Students across high school and higher education levels frequently struggle with fragmented study materials, lack of clear career progression roadmaps, and unengaging learning portals with poor onboarding workflows.",
    solution:
      "Developed a fluidly animated, responsive e-learning hub featuring guided level-based learning paths (11th, 12th, Graduation, Post-Graduation), comprehensive career roadmaps, interactive question banks, an AI study assistant, and an engaging introductory onboarding flow.",
    image: "/projects/brightpath.svg",
    duration: "May 2025 – June 2025",
    technologies: [
      "Next.js",
      "React.js",
      "Tailwind CSS",
      "GSAP",
      "JavaScript",
      "HTML5",
    ],
    features: [
      "Smart onboarding flow introducing platform features before login/signup prompts",
      "Tailored learning material for Class 11th, 12th, Graduation, and Post-Graduation levels",
      "Interactive career roadmaps with structured milestones and guidance",
      "Comprehensive Question Bank for practice and exam preparation",
      "Personalized AI Assistant for 24/7 study guidance and learning support",
      "Smooth timeline animations and interactive transitions crafted with GSAP",
      "Fully responsive, mobile-first design built with Next.js and Tailwind CSS",
    ],
    technicalImplementation:
      "Built with Next.js and React using modern component architecture. Styled with Tailwind CSS for high-performance utility-first styling and animated with GSAP for smooth timeline animations, scroll-triggered reveals, and interactive onboarding transitions. Integrated state handling to seamlessly route authenticated users across Courses, Roadmaps, Question Bank, and AI Assistant.",
    challenges:
      "Designing an intuitive multi-level curriculum navigation while orchestrating seamless GSAP intro animations that enhance user engagement without disrupting page responsiveness or loading performance.",
    keyLearnings:
      "Gained deep hands-on expertise in Next.js frontend architecture, complex GSAP timeline orchestration, state-driven onboarding workflows, and building scalable UI component libraries with Tailwind CSS.",
    githubUrl: "https://github.com/khustar04",
    liveUrl: "https://bright-path-peach.vercel.app/",
    status: "featured",
  },
  {
    id: "ai-job-finder",
    slug: "ai-job-finder",
    title: "AI-Powered Resume-Based Job Finder",
    shortDescription:
      "An intelligent job discovery platform that parses uploaded resumes using Apache Tika, extracts skill profiles via Gemini AI, and scores/ranks relevant job openings.",
    fullDescription:
      "An AI-enabled full-stack career platform designed to automate and personalize the job search process. Users upload their resumes (PDF/DOC), which are parsed using Apache Tika. The platform leverages Google's Gemini AI to extract candidate skills, experience level, and target roles, then matches and ranks job openings fetched from external APIs (Adzuna) with personalized resume scoring.",
    problemStatement:
      "Job seekers spend hours manually searching generic job boards and tailoring resumes without clear feedback on skill alignment, leading to low match rates and inefficient application workflows.",
    solution:
      "Built an AI-driven resume analyzer and job ranking engine that evaluates resume fitness, pinpoints missing keywords/skills, and ranks job openings by match score, relevance, and posting recency.",
    image: "/projects/ai-job-finder.svg",
    technologies: [
      "React.js",
      "Google Gemini API",
      "Adzuna API",
      "Apache Tika",
      "JavaScript",
      "Tailwind CSS",
      "JSON",
      "REST API",
    ],
    features: [
      "AI resume analysis module extracting skills, experience level, and target roles from PDF/DOC files",
      "Document parsing with Apache Tika for structured text extraction",
      "Integration with external job-listing APIs (Adzuna) to fetch live job openings",
      "Intelligent ranking engine to score and sort listings by skill fit, relevance, and recency",
      "Interactive dashboard showing overall resume score and missing skill gap analysis",
      "AI-generated resume improvement suggestions with date-based sorting for new postings",
    ],
    technicalImplementation:
      "Frontend constructed with React.js and Tailwind CSS featuring a drag-and-drop document upload interface. Document parsing leverages Apache Tika, while candidate profile extraction and skill analysis are executed through Gemini AI API. External job aggregation is powered by Adzuna API with custom scoring algorithms.",
    challenges:
      "Handling heterogeneous resume document structures and formatting variations while extracting structured skill tags accurately through LLM prompt engineering and API rate limits.",
    keyLearnings:
      "Acquired expertise in AI/LLM API integration, prompt engineering for structured JSON output, document text extraction pipelines, and external REST API data aggregation and scoring.",
    githubUrl: "https://github.com/khustar04",
    liveUrl: "",
    status: "featured",
  },
  {
    id: "ecommerce-backend-api",
    slug: "ecommerce-backend-api",
    title: "E-Commerce RESTful Backend API",
    shortDescription:
      "Scalable e-commerce backend built with Spring Boot, Spring Security, Hibernate ORM, and MySQL supporting role-based access, product catalogs, and order management.",
    fullDescription:
      "A complete, production-grade e-commerce RESTful API designed with clean layered architecture (Controller, Service, Repository, DTO). Implements stateless JWT authentication, customer and admin role-based authorization, category and product catalog with pagination/filtering, shopping cart management, and transactional order checkout with database constraints.",
    problemStatement:
      "Modern e-commerce platforms need reliable, secure backend services that ensure transactional consistency during checkout and provide performant catalog query endpoints.",
    solution:
      "Developed a robust Spring Boot REST service with Hibernate ORM, custom validation filters, centralized exception handling, and optimized indexed MySQL queries.",
    image: "/projects/ecommerce-api.svg",
    technologies: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Hibernate ORM",
      "MySQL",
      "JWT",
      "Maven",
      "REST API",
    ],
    features: [
      "JWT stateless authentication and authorization with role-based permissions",
      "Product catalog with dynamic category filters, search, and pagination",
      "Shopping cart session management with stock verification",
      "Transactional order placement and invoice generation",
      "Centralized error handling and clean REST response envelopes",
      "Swagger/OpenAPI documentation for all REST endpoints",
    ],
    technicalImplementation:
      "Architected with Spring Boot and Spring Data JPA. Utilizes BCrypt password hashing, Spring Security filter chains, Hibernate ORM with MySQL 8.0, and Maven dependency management.",
    challenges:
      "Preventing race conditions during high-concurrency checkout and inventory stock updates.",
    keyLearnings:
      "Mastered database transaction boundaries, ACID guarantees in Spring, and secure API design patterns.",
    githubUrl: "https://github.com/khustar04",
    liveUrl: "",
    status: "completed",
  },
  {
    id: "task-workflow-api",
    slug: "task-workflow-api",
    title: "Task & Workflow Management API",
    shortDescription:
      "Collaborative project and task tracking backend with Spring Boot, Spring Security, PostgreSQL, and role-based team management.",
    fullDescription:
      "A modular workflow and task tracking backend service enabling organizations to create workspaces, assign tasks across team members, monitor sprint statuses, and track project deadlines with audit logs and notification triggers.",
    problemStatement:
      "Engineering teams require clean, predictable REST APIs to track issue lifecycles, project milestones, and assignment accountability across distributed teams.",
    solution:
      "Engineered a scalable Spring Boot REST API utilizing PostgreSQL, JPA auditing, and fine-grained role-based security.",
    image: "/projects/task-management.svg",
    technologies: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "PostgreSQL",
      "Hibernate",
      "JWT",
      "REST API",
    ],
    features: [
      "Workspace and team hierarchy management with granular access control",
      "Kanban board task state transitions (To Do, In Progress, Review, Done)",
      "Automated timestamp auditing and task activity change history",
      "Priority filtering, due date tracking, and assignment notifications",
      "Centralized global exception handling with structured error payloads",
    ],
    technicalImplementation:
      "Built with Spring Boot and PostgreSQL. Employs Spring Data JPA repositories with custom JPQL queries, DTO projection for fast responses, and stateless JWT tokens.",
    challenges:
      "Designing a clean data model that supports nested team hierarchies without recursive query bottlenecks.",
    keyLearnings:
      "Deepened knowledge of relational schema optimization, JPQL indexing, and clean software architecture principles.",
    githubUrl: "https://github.com/khustar04",
    liveUrl: "",
    status: "completed",
  },
  {
    id: "realtime-chat-engine",
    slug: "realtime-chat-engine",
    title: "Real-Time WebSocket Messaging Service",
    shortDescription:
      "Real-time bidirectional messaging application built with Spring Boot WebSocket, STOMP protocol, React 18, and MySQL.",
    fullDescription:
      "A high-concurrency real-time communication platform supporting instant private chat, public topic rooms, online user presence detection, and message history persistence with WebSocket / STOMP protocol.",
    problemStatement:
      "Standard HTTP request-response polling creates excessive server overhead for live messaging and collaboration features.",
    solution:
      "Implemented a persistent WebSocket broker with Spring Boot and STOMP message routing to deliver sub-millisecond real-time communication.",
    image: "/projects/realtime-chat.svg",
    technologies: [
      "Java",
      "Spring Boot",
      "WebSocket",
      "STOMP",
      "React 18",
      "Tailwind CSS",
      "MySQL",
    ],
    features: [
      "Bidirectional instant messaging with Spring WebSocket and STOMP broker",
      "Private 1-on-1 direct messaging and multi-user discussion channels",
      "Live user presence, typing indicators, and message timestamps",
      "Message history persistence in MySQL with pagination",
      "Responsive React 18 frontend with optimistic message rendering",
    ],
    technicalImplementation:
      "Spring Boot WebSocket backend with message broker configuration. Frontend built in React 18 utilizing SockJS and STOMP.js client libraries.",
    challenges:
      "Managing socket connection state, handling reconnection scenarios, and message delivery guarantees.",
    keyLearnings:
      "Gained hands-on experience in full-duplex communication protocols, event-driven messaging, and state synchronization.",
    githubUrl: "https://github.com/khustar04",
    liveUrl: "",
    status: "completed",
  },
];
