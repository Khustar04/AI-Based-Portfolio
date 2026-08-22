# 🚀 Khustar Hussain — Developer Portfolio & Admin Platform

> Modern, high-performance portfolio featuring full-stack case studies, interactive AI assistant with command execution, and a dedicated control panel.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-API-4285F4?logo=google)

---

## 🌟 Key Features

- **⚡ Modern Glassmorphism & GSAP Animations**: Smooth reveal timelines, ambient background glows, and interactive card physics.
- **🤖 Dual-Mode AI Assistant (FRIDAY)**:
  - **Visitor Mode**: Answers questions about skills, Streakify, BrightPath, experience, and certifications.
  - **Admin Command Mode**: Executes instant natural language modifications (adding projects, updating bio, changing name, modifying skills) directly to state and local storage.
- **🛠️ Dedicated Control Panel (`/manage-portfolio`)**:
  - Full CRUD control over Projects, Skills, Certifications, Education, Profile, and Socials.
  - Client-side canvas image compression to keep storage lightweight.
  - One-click JSON backup export & restore.
- **📄 Interactive Printable Resume (`/resume`)**: Full-page interactive resume with direct PDF download integration.
- **📦 Dynamic Project & Certification Case Studies**: Dedicated routes (`/projects/:slug`, `/certifications/:slug`) with rich problem statements and architecture diagrams.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, React Router DOM 7, Lucide Icons
- **Animations**: GSAP (GreenSock), ScrollTrigger, Framer Motion
- **AI & Integrations**: Google Gemini API (`gemini-3.5-flash`), Google Sheets Webhook
- **Build Tool**: Vite 8

---

## 🚀 Deployment to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. Push your repository to **GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete portfolio with admin panel and AI assistant"
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set **Environment Variables** in the Vercel dashboard:
   - `VITE_GEMINI_API_KEY` = `your_gemini_api_key`
   - `VITE_GOOGLE_SHEET_URL` = `your_google_sheet_webhook_url`
5. Click **"Deploy"**.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production build test
npm run build
```

---

## 🔒 Admin Access
To access the Admin Control Panel locally or in production, navigate to:
`/manage-portfolio` (Default PIN: `admin123`).
