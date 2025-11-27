# SkillHubX - AI Powered Micro-Learning Platform

A complete, modern web application for sharing skills, earning rewards, and AI-assisted learning. Built with Next.js 14, Prisma, MongoDB, Clerk, and Tailwind CSS.

## Features
- **Secure Authentication**: Clerk-based auth with User, Admin, and SuperAdmin roles.
- **Content Management**: Upload Videos (MP4) and PDFs. Admin approval workflow.
- **DRM-Style Streaming**: Dynamic floating watermarks and canvas overlays to deter piracy.
- **Gamification**: Earn coins by watching videos (95% completion).
- **AI Helper**: Generate quizzes and notes using Google Gemini AI.
- **Modern UI**: Dark theme, glassmorphism, and neon aesthetics using Tailwind & Framer Motion.

## Tech Stack
- **Framework**: Next.js 14 (App Router, Server Actions)
- **Database**: MongoDB (via Prisma ORM)
- **Auth**: Clerk
- **Styling**: Tailwind CSS, Framer Motion
- **AI**: Google Generative AI (Gemini)

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Ensure `.env` contains:
    ```env
    DATABASE_URL="mongodb+srv://SkillHub:vikasH123@cluster0.dxsvxwp.mongodb.net/skillhubx?retryWrites=true&w=majority"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dGhvcm91Z2gtYnVsbGRvZy02Ni5jbGVyay5hY2NvdW50cy5kZXYk
    CLERK_SECRET_KEY=sk_test_cKTLQGDMfSLs7PA70ITbDnGzpj7vakGIOawy34WGgC
    GEMINI_API_KEY="your-api-key" # Optional for AI features
    ```

3.  **Database Setup**
    ```bash
    npx prisma generate
    # Note: Prisma with MongoDB doesn't require 'migrate'. Schema is applied on write.
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **Run Production Build**
    ```bash
    npm run build
    npm start
    ```

## Implementation Notes
- **AI/OCR**: Currently mocks the AI response if no API Key is provided. Real integration code is in `src/lib/ai-helper.ts`.
- **Uploads**: Currently mocks file storage by storing a fake URL. For production, integrate AWS S3 or Uploadthing in `src/lib/actions.ts`.
- **Admins**: The first user is a regular USER. To create an admin, manually update the DB or use the SuperAdmin panel (requires one SuperAdmin seeded manually in DB via Compass/Atlas).

## Commands
- `npm run dev`: Start dev server.
- `npx prisma studio`: View database content.
