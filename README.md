# Tayf - Branch Management System

Goal
Build a small multi-tenant web application where a Super Admin can create Branches, and each
Branch contains Branch Admins that can log in and manage their own branch’s menu and raw
materials. This task evaluates API design, authentication, authorization, data isolation, and a simple
frontend.

## Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT Authentication

**Frontend:**
- React
- React Router

## Prerequisites

- Docker Desktop
- Node.js 20+
- Git

## Setup

### 1. Clone and navigate
```bash
git clone <repo-url>
cd Tayf
```

### 2. Start PostgreSQL
```bash
docker-compose up -d
```

### 3. Backend setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

Backend runs on http://localhost:5000

### 4. Frontend setup (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

## Test Accounts

**Super Admin:**
- Email: superadmin@tayf.com
- Password: SuperAdmin123!

**Branch Admin:**
- Email: admin@downtown.tayf.com
- Password: BranchAdmin123!

## Useful Commands

**Database:**
```bash
docker-compose up -d          # Start PostgreSQL
docker-compose down           # Stop PostgreSQL
docker-compose down -v        # Delete all data
```

**Backend:**
```bash
npm run dev                   # Start server
npx prisma studio            # Open database GUI
npm run seed                 # Add test data
npx prisma migrate reset     # Reset database
```

**Frontend:**
```bash
npm run dev                   # Start dev server
npm run build                # Build for production
```

## Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/tayf
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=development
PORT=5000
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```