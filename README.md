# 🌍 Immigration Radar

A data-driven global immigration intelligence platform that tracks real-time visa updates, salary thresholds, and policy changes across numerous countries. 

Designed for advisers, employers, and expats, Immigration Radar replaces manual monitoring with a structured database populated from verified government sources. Users can browse the global immigration timeline, filter updates by country and visa type, and create customized watchlists to receive automated email alerts on specific changes.

## ✨ Key Features
- **Live Intelligence Database:** Search, filter, and sort immigration rule changes across the globe.
- **Personalized Watchlist (Auth-Protected):** Built-in user authentication allows you to subscribe to specific countries, visa types, and severity levels to receive email notifications on updates.
- **Historical Timeline:** See the broader direction of global immigration trends with a detailed, chronological breakdown of rule evolutions.
- **Verified Sources Only:** Every entry links directly back to the official government authority that issued it.

## 🛠 Tech Stack
- **Frontend Framework:** React 18, Vite, TypeScript
- **Routing:** TanStack Router (File-based routing)
- **Styling:** Vanilla CSS & Tailwind CSS (Glassmorphic UI)
- **Backend/Database:** Supabase (PostgreSQL, Row Level Security, Auth)
- **Deployment & Architecture:** Vite server-side capabilities, automated email API hooks.

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/global-watcher.git
cd global-watcher
npm install
```

### 2. Configure Supabase Environment
Create a `.env` file in the project root and add your Supabase credentials:
```env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_URL="https://your_project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_public_key"
```

### 3. Database Migration
Navigate to the Supabase SQL Editor and execute the provided migrations from the `database_migration_and_seed.sql` file (or use the Supabase CLI if configured locally). This creates the necessary tables (`countries`, `immigration_changes`, `timelines`) and configures Row Level Security (RLS).

### 4. Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

## 📄 License
This project is proprietary and confidential. Not licensed for public distribution.
