# Subscription Tracker API

A backend service built to help users track their recurring subscriptions, analyze monthly spending, and receive automated reminders before renewals.

## 🚀 Features

* **Subscription Management**: CRUD operations for tracking subscriptions (Netflix, Spotify, etc.) with details like frequency, category, and pricing.
* **Smart Reminders**: Automated email (via Resend) and browser push notifications for upcoming renewals.
* **Analytics Dashboard**: Visual breakdown of monthly spend and category-wise distribution.
* **Secure Authentication**: JWT-based auth with Access & Refresh token rotation.
* **Background Jobs**: `node-cron` schedulers to handle daily reminder checks.

## 🛠️ Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Validation**: Zod
* **Tools**: Docker (for DB), Nodemon

## ⚡ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/ambuj-baranwal/subscription-tracker.git
cd subscription-tracker
npm install

```

### 2. Environment Setup

Create a `.env` file in the root directory. You'll need keys for the database, JWT, and email services:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (Postgres)
DATABASE_URL="postgresql://user:password@localhost:5432/tracker_db"

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

# Email & Notifications
RESEND_API_KEY=re_123456
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_EMAIL=mailto:your@email.com

```

### 3. Database Setup

You can spin up a local Postgres instance using the provided Docker Compose file:

```bash
# Start Postgres container
docker-compose up -d

# Run Prisma migrations
npx prisma migrate dev --name init

```

### 4. Run the Server

```bash
# Development mode
npm run dev

# Production start
npm start

```

## ue API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/auth/sign-up` | Register a new user |
| `POST` | `/api/v1/auth/sign-in` | Login and get tokens |
| `GET` | `/api/v1/subscriptions` | Get all active subscriptions |
| `POST` | `/api/v1/subscriptions` | Add a new subscription |
| `GET` | `/api/v1/dashboard/stats` | Get total spend & active count |
| `GET` | `/api/v1/dashboard/upcoming` | Get upcoming renewals |
