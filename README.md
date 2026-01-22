# AI-Powered Job Tracker

A production-ready Job Tracking Application with AI capabilities, built with the "PERN" stack (but currently in-memory/mock for easy demo).

## Features
- **Smart Job Matching:** AI scores jobs against your resume.
- **Job Feed:** Aggregated jobs (Mock/JSearch) with filtering.
- **Application Tracking:** Intelligent popup flow to track external applications.
- **AI Assistant:** Chat sidebar for help and queries.
- **Resume Parsing:** Extracts text from PDF/TXT.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, React Query.
- **Backend:** Node.js (Fastify), JWT Auth, OpenAI Integration.

## Setup

1. **Install Dependencies**
   ```bash
   # Server
   cd server
   npm install

   # Client
   cd ../client
   npm install
   ```

2. **Environment Variables**
   Create `server/.env`:
   ```env
   PORT=3000
   JWT_SECRET=supersecret
   OPENAI_API_KEY=sk-... (optional)
   JSEARCH_API_KEY=... (optional)
   ```

3. **Run Development**
   ```bash
   # Terminal 1 (Server)
   cd server
   npm run dev

   # Terminal 2 (Client)
   cd client
   npm run dev
   ```

## Usage
1. Login (Email only).
2. Upload Resume.
3. Browse & Filter Jobs.
4. Apply & Track.
