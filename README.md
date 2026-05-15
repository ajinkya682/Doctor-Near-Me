<div align="center">

<img src="https://img.shields.io/badge/Doctor%20Near%20Me-Healthcare%20Platform-0EA5E9?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMyAxN2gtMnYtNkg5di0yaDJ2LTJIMTN2Mmgydi0yaC0ydjZ6Ii8+PC9zdmc+" alt="Doctor Near Me" />

# 🏥 Doctor Near Me

### *The Smartest Way to Find, Book & Connect with Doctors Globally*

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![WhatsApp Bot](https://img.shields.io/badge/WhatsApp-Bot%20Enabled-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://twilio.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)]()
[![i18n](https://img.shields.io/badge/i18n-4%20Languages-orange?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

<br/>

> **Doctor Near Me** is a full-stack, production-ready healthcare booking platform built on the MERN stack.  
> Patients find nearby clinics, book appointments in seconds, and even book via WhatsApp — all in their preferred language.  
> It looks and feels like a native mobile app in the browser, while also delivering a polished desktop experience.

<br/>

[🚀 Live Demo](#) · [📖 API Docs](#api-documentation) · [💬 WhatsApp Bot](#whatsapp-bot) · [🐛 Report a Bug](issues) · [✨ Request a Feature](issues)

---

</div>

<br/>

## 📋 Table of Contents

- [🌟 Platform Summary](#-platform-summary)
- [✨ Features Showcase](#-features-showcase)
- [🏗️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [📁 Project Structure](#-project-structure)
- [⚙️ Setup & Installation Guide](#️-setup--installation-guide)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Documentation](#-api-documentation)
- [🤖 WhatsApp Bot](#-whatsapp-bot)
- [🌍 Internationalization (i18n)](#-internationalization-i18n)
- [🎨 UI/UX Design System](#-uiux-design-system)
- [🚀 Deployment Guide](#-deployment-guide)
- [🛡️ Security](#️-security)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

<br/>

## 🌟 Platform Summary

**Doctor Near Me** solves a universal problem: finding and booking a trusted doctor quickly, without phone tag, without confusion, and in the user's own language.

### The Problem We Solve

| Pain Point | Our Solution |
|---|---|
| Patients don't know which clinics are nearby | Real-time geolocation search with Google Maps |
| Booking requires phone calls and long waits | Instant slot booking, 24/7, from any device |
| Not everyone uses a smartphone app | Full WhatsApp bot — no app download needed |
| Language barriers in healthcare | 4 languages: English, Hindi, Marathi, Gujarati |
| Desktop and mobile need different experiences | One codebase, two premium experiences |
| No reminders = missed appointments | Automated WhatsApp reminders 1 hour before |

### Who Is This For?

- **Patients** — Find nearby doctors, view real availability, book in 3 taps, reschedule or cancel anytime.
- **Clinics & Hospitals** — Get a digital presence, manage doctor schedules, receive bookings automatically.
- **Doctors** — Manage their daily schedule, accept or decline bookings, and review patient history.
- **Administrators** — Onboard clinics, verify doctors, and view platform analytics.

### Platform Highlights

- 📱 **Mobile-first, app-like feel** — Works in the browser. No install required.
- 🗺️ **Live map with clinic markers** — Real-time nearby search powered by MongoDB GeoJSON.
- 💬 **WhatsApp booking bot** — Full multi-step booking flow via Twilio WhatsApp API.
- 🌗 **Light & Dark mode** — Respects system preference on first load.
- 🌐 **Multilingual** — English, Hindi, Marathi, Gujarati.
- 🔔 **Live notifications** — Real-time confirmation via Socket.io.
- ⚡ **PWA installable** — Runs like a native app on iOS and Android.
- 🔒 **Secure by default** — JWT, OTP auth, rate limiting, Helmet, HTTPS only.

---

<br/>

## ✨ Features Showcase

### 🔑 Authentication
- **Phone OTP Login** — No passwords. Users enter their phone number, receive a 6-digit OTP via Twilio SMS, and are logged in.
- **JWT + Refresh Token** — Access tokens expire in 15 minutes. Refresh tokens (7 days, httpOnly cookie) silently renew sessions without re-login.
- **Role-based Access** — Three roles: `patient`, `doctor`, `admin`. The backend middleware enforces each route's access level.

### 🏠 Home Page
- Personalized greeting with the patient's name and current date.
- Horizontal scrollable specialty chips (Cardiologist, Dermatologist, Dentist, etc.) for quick filtered search.
- "Clinics Near You" — Shows 2–3 closest clinics as horizontal scrollable cards, fetched from real geolocation.
- "Upcoming Appointments" — The patient's next booking shown as a status card.
- WhatsApp Bot banner — A one-tap shortcut to start booking via WhatsApp.

### 🔍 Search & Map
- **List View** — Filterable, sortable cards with specialty, distance, rating, and availability filters.
- **Map View** — Google Maps with custom branded SVG markers. Tap a marker → bottom sheet slides up with clinic preview.
- **Geolocation** — Browser asks for location permission. If denied, shows a fallback manual search.

### 🏥 Clinic Detail Page
- Full-width header photo with overlaid back button.
- Open/Closed status computed from live current time vs. clinic hours.
- Doctor list at this clinic with quick "Book" shortcut.
- Get Directions button (opens Google Maps deep link with coordinates).

### 👨‍⚕️ Doctor Profile Page
- Scrollable 14-day date picker ribbon.
- Time slots grouped into Morning / Afternoon / Evening sections.
- Real-time slot availability — already-booked slots are hidden.
- Reviews section with star ratings and pagination.

### 📅 Booking Flow
- Confirmation screen with doctor photo, clinic, date, time, fee, and optional patient notes.
- Atomic booking — uses a MongoDB transaction to prevent double-booking race conditions.
- Success screen with animated checkmark, booking reference number, and "Add to Calendar" option.
- Failure handling — If slot was just taken, graceful error with redirect to re-select a slot.

### 📋 My Bookings
- **Upcoming tab** — Sorted by soonest. Each card has Reschedule and Cancel actions.
- **Past tab** — Completed bookings show "Write Review" button. Cancelled show "Book Again".
- Cancel requires ≥2 hours before the appointment. A confirmation bottom sheet appears before proceeding.

### 👤 Profile & Settings
- Edit name, email, profile photo (uploads to Cloudinary).
- Language switcher with bottom sheet picker.
- Light/Dark theme toggle with animated sun/moon icon.
- Notification preferences toggle.

### 🩺 Doctor Dashboard
- Today's appointment timeline.
- Availability toggle (Available / On Leave).
- Working hours and break time slot management.

### 🛠️ Admin Dashboard
- Add and verify clinics and doctors.
- View all bookings across the platform.
- Stats: bookings this month, top clinics, most-booked specialties.

---

<br/>

## 🏗️ Tech Stack & Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser / PWA)                       │
│   React 18 · Vite · TailwindCSS · Framer Motion · Zustand           │
│   React Query · React Router v6 · i18next · Google Maps SDK         │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS / REST / WebSocket
┌────────────────────────────▼────────────────────────────────────────┐
│                     SERVER (Node.js + Express)                       │
│  Routes → Controllers → Services → Models                           │
│  Auth · Clinics · Doctors · Appointments · Reviews · Webhooks       │
│  Socket.io (real-time) · node-cron (reminders)                      │
└──────┬──────────────┬──────────────────┬───────────────┬────────────┘
       │              │                  │               │
┌──────▼──────┐ ┌─────▼──────┐  ┌───────▼──────┐ ┌─────▼──────────┐
│  MongoDB    │ │ Cloudinary  │  │    Twilio    │ │  Google Maps   │
│  Atlas      │ │  (Images)   │  │ SMS+WhatsApp │ │   Places API   │
└─────────────┘ └────────────┘  └──────────────┘ └────────────────┘
```

### Frontend Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI component library |
| Vite | 5 | Build tool and dev server |
| React Router | v6 | Client-side routing |
| Zustand | 4 | Global state management |
| React Query (TanStack) | 5 | Server state, caching, background refetch |
| Framer Motion | 11 | Page transitions, animations |
| TailwindCSS | 3 | Utility-first styling |
| shadcn/ui | latest | Accessible UI component library |
| React Hook Form + Zod | latest | Form handling and validation |
| i18next | 23 | Internationalization |
| @react-google-maps/api | latest | Google Maps integration |
| Axios | 1 | HTTP client with interceptors |
| Lucide React | latest | Icons |
| date-fns | 3 | Date formatting and manipulation |
| react-hot-toast | 2 | Toast notifications |

### Backend Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4 | HTTP server framework |
| Mongoose | 8 | MongoDB ODM |
| jsonwebtoken | 9 | JWT access + refresh tokens |
| bcryptjs | 2 | Password hashing (admin accounts) |
| Twilio | 5 | SMS OTP + WhatsApp API |
| Nodemailer | 6 | Email notifications |
| Multer | 1 | Multipart file upload handling |
| Cloudinary | 2 | Cloud image storage |
| Socket.io | 4 | Real-time bidirectional communication |
| node-cron | 3 | Scheduled reminder jobs |
| Helmet | 7 | HTTP security headers |
| express-rate-limit | 7 | API rate limiting |
| express-validator | 7 | Request input validation |
| cors | 2 | Cross-origin resource sharing |
| dotenv | 16 | Environment variable loading |
| axios | 1 | Internal HTTP calls (bot to API) |

### Database Design

**MongoDB Atlas** with 6 collections:

```
doctors_nearme (Database)
├── users          → Patients: phone, name, location, bookings[], role
├── doctors        → Profile, specialization, fee, rating, clinic ref
├── clinics        → GeoJSON location, hours, photos, doctors[]
├── appointments   → Patient, doctor, clinic, date, slot, status
├── reviews        → Rating, comment, linked to appointment
└── whatsappsessions → Bot conversation state machine per phone number
```

**Geospatial indexing:**
```javascript
// Enables $nearSphere and $geoNear queries for clinic proximity search
ClinicSchema.index({ location: '2dsphere' });
```

---

<br/>

## 📁 Project Structure

```
doctor-near-me/
│
├── client/                          # React Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── manifest.json            # PWA manifest
│   │   └── icons/                   # PWA icons (192x192, 512x512)
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── ClinicDetail.jsx
│   │   │   ├── DoctorProfile.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── BookingSuccess.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── DoctorCard.jsx
│   │   │   ├── ClinicCard.jsx
│   │   │   ├── SlotPicker.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── BottomNavBar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── BookingCard.jsx
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── LoadingSkeletons.jsx
│   │   │   └── OTPInput.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx        # Shell with BottomNavBar + TopBar
│   │   │
│   │   ├── hooks/
│   │   │   ├── useGeolocation.js
│   │   │   ├── useAuth.js
│   │   │   └── useTheme.js
│   │   │
│   │   ├── store/
│   │   │   ├── authStore.js         # Zustand: user, token, isLoggedIn
│   │   │   ├── themeStore.js        # Zustand: light/dark + localStorage
│   │   │   └── languageStore.js     # Zustand: active language
│   │   │
│   │   ├── i18n/
│   │   │   ├── index.js             # i18next setup
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   ├── mr.json
│   │   │   └── gu.json
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js               # Axios instance + interceptors
│   │   │   └── utils.js             # Helpers (date format, slot grouping)
│   │   │
│   │   ├── App.jsx                  # Router + AnimatePresence
│   │   ├── main.jsx                 # Entry point, QueryClientProvider
│   │   └── index.css                # Tailwind directives + CSS vars
│   │
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node + Express Backend
│   ├── config/
│   │   ├── db.js                    # MongoDB Atlas connection
│   │   └── cloudinary.js            # Cloudinary setup
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Clinic.js
│   │   ├── Appointment.js
│   │   ├── Review.js
│   │   └── WhatsappSession.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── clinic.routes.js
│   │   ├── doctor.routes.js
│   │   ├── appointment.routes.js
│   │   ├── review.routes.js
│   │   ├── upload.routes.js
│   │   └── webhook.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── clinic.controller.js
│   │   ├── doctor.controller.js
│   │   ├── appointment.controller.js
│   │   ├── review.controller.js
│   │   └── webhook.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT verification + req.user
│   │   ├── role.middleware.js       # Role guard (patient/doctor/admin)
│   │   └── validate.middleware.js   # express-validator error handler
│   │
│   ├── services/
│   │   ├── twilio.service.js        # OTP + WhatsApp message sending
│   │   ├── slot.service.js          # Slot generation + availability check
│   │   ├── reminder.service.js      # node-cron reminder job
│   │   └── socket.service.js        # Socket.io room management
│   │
│   ├── utils/
│   │   └── botFlow.js               # WhatsApp state machine logic
│   │
│   ├── server.js                    # Express entry point
│   ├── .env                         # ← Never commit this
│   ├── .env.example                 # Safe template to commit
│   └── package.json
│
├── .gitignore
└── README.md
```

---

<br/>

## ⚙️ Setup & Installation Guide

### Prerequisites

Make sure you have the following installed before starting:

| Requirement | Minimum Version | Check Command |
|---|---|---|
| Node.js | v18.0.0 | `node --version` |
| npm | v9.0.0 | `npm --version` |
| Git | any recent | `git --version` |
| MongoDB Atlas account | — | [mongodb.com](https://mongodb.com) |
| Twilio account | — | [twilio.com](https://twilio.com) |
| Cloudinary account | — | [cloudinary.com](https://cloudinary.com) |
| Google Cloud account | — | [console.cloud.google.com](https://console.cloud.google.com) |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/doctor-near-me.git
cd doctor-near-me
```

---

### Step 2 — Setup the Backend (Server)

```bash
# Navigate to server directory
cd server

# Install all dependencies
npm install

# Copy the environment variable template
cp .env.example .env
```

Now open `.env` and fill in all your API keys (see [Environment Variables](#-environment-variables) section below).

```bash
# Start the development server (with auto-restart on file changes)
npm run dev
```

The server will start on `http://localhost:5000`. You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
```

---

### Step 3 — Seed the Database (Optional but Recommended)

After connecting MongoDB, seed some sample clinic and doctor data to test with:

```bash
# From the /server directory
npm run seed
```

This creates 5 sample clinics with GeoJSON coordinates and 10 sample doctors across different specialties.

---

### Step 4 — Setup the Frontend (Client)

Open a new terminal window:

```bash
# Navigate to client directory
cd client

# Install all dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

Fill in your Google Maps API key and backend URL in `.env.local`.

```bash
# Start the React development server
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

### Step 5 — Run Both Together (Recommended)

From the root of the project, you can run both simultaneously using the root-level dev script:

```bash
# From the project root
npm install        # Installs concurrently
npm run dev        # Starts both server and client
```

Ensure your root `package.json` has:

```json
{
  "scripts": {
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\""
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

---

### Step 6 — Configure Twilio WhatsApp Sandbox (For Bot Testing)

1. Go to your [Twilio Console](https://console.twilio.com) → Messaging → Try it Out → WhatsApp.
2. Follow the sandbox join instructions (send a keyword to the sandbox number from your WhatsApp).
3. In Sandbox Settings, set the **"When a message comes in"** webhook to:
   ```
   https://your-ngrok-url.ngrok.io/api/webhook/whatsapp
   ```
4. For local testing, use [ngrok](https://ngrok.com) to expose your localhost:
   ```bash
   ngrok http 5000
   ```

---

<br/>

## 🔐 Environment Variables

### Server — `/server/.env`

```env
# ─── Application ────────────────────────────────────────────
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# ─── MongoDB ─────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/doctornearme

# ─── JWT Authentication ───────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
REFRESH_TOKEN_EXPIRES_IN=7d

# ─── Twilio (OTP + WhatsApp) ──────────────────────────────────
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# ─── Cloudinary (Image Uploads) ───────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── Email (Nodemailer) ───────────────────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_specific_password

# ─── Google Maps (Backend validation only) ────────────────────
GOOGLE_MAPS_API_KEY=your_google_maps_server_key
```

### Client — `/client/.env.local`

```env
# ─── Backend API ─────────────────────────────────────────────
VITE_API_URL=http://localhost:5000/api

# ─── Google Maps (Frontend) ───────────────────────────────────
VITE_GOOGLE_MAPS_KEY=your_google_maps_browser_key

# ─── App Config ───────────────────────────────────────────────
VITE_APP_NAME=Doctor Near Me
VITE_WHATSAPP_BOT_NUMBER=+14155238886
```

> ⚠️ **Security Note:** Never commit `.env` or `.env.local` files. They are already in `.gitignore`. Only commit `.env.example` files with placeholder values.

---

<br/>

## 📡 API Documentation

**Base URL:** `https://your-domain.com/api`  
**Auth:** Bearer token in `Authorization` header (except public routes)  
**Content-Type:** `application/json`

---

### 🔑 Authentication

#### Request OTP
```http
POST /auth/request-otp
```
```json
// Request Body
{
  "phone": "+919876543210"
}

// Response 200
{
  "message": "OTP sent successfully",
  "channel": "sms"
}
```

#### Verify OTP & Login
```http
POST /auth/verify-otp
```
```json
// Request Body
{
  "phone": "+919876543210",
  "otp": "482910"
}

// Response 200
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Ravi Kumar",
    "phone": "+919876543210",
    "role": "patient"
  }
}
// Note: refreshToken is set as httpOnly cookie automatically
```

#### Refresh Access Token
```http
POST /auth/refresh
```
```
// No body needed. Reads refreshToken from cookie.

// Response 200
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /auth/logout
```
```json
// Response 200
{
  "message": "Logged out successfully"
}
// Clears the httpOnly refresh token cookie
```

---

### 🏥 Clinics

#### Get Nearby Clinics
```http
GET /clinics/nearby?lat={lat}&lng={lng}&radius={km}&specialty={name}&minRating={1-5}
```
```json
// Example: GET /clinics/nearby?lat=19.0760&lng=72.8777&radius=5&specialty=Cardiologist

// Response 200
{
  "count": 3,
  "clinics": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "City Heart Clinic",
      "address": "42 MG Road, Andheri, Mumbai",
      "distance": 1.2,         // in kilometers
      "rating": 4.7,
      "photos": ["https://res.cloudinary.com/..."],
      "isOpen": true,
      "doctors": [
        {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
          "name": "Dr. Priya Sharma",
          "specialization": "Cardiologist",
          "fee": 800
        }
      ],
      "location": {
        "type": "Point",
        "coordinates": [72.8777, 19.0760]
      }
    }
  ]
}
```

#### Get Clinic Details
```http
GET /clinics/:clinicId
```
```json
// Response 200
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "name": "City Heart Clinic",
  "address": "42 MG Road, Andheri, Mumbai",
  "phone": "+912240012345",
  "email": "contact@cityheart.com",
  "hours": {
    "monday":    { "open": "09:00", "close": "20:00" },
    "tuesday":   { "open": "09:00", "close": "20:00" },
    "wednesday": { "open": "09:00", "close": "20:00" },
    "thursday":  { "open": "09:00", "close": "20:00" },
    "friday":    { "open": "09:00", "close": "18:00" },
    "saturday":  { "open": "10:00", "close": "16:00" },
    "sunday":    null
  },
  "rating": 4.7,
  "totalReviews": 214,
  "photos": ["https://res.cloudinary.com/..."],
  "doctors": [ /* full doctor objects */ ]
}
```

---

### 👨‍⚕️ Doctors

#### Get Doctor Profile
```http
GET /doctors/:doctorId
```
```json
// Response 200
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
  "name": "Dr. Priya Sharma",
  "specialization": "Cardiologist",
  "experience": 12,
  "fee": 800,
  "languages": ["English", "Hindi"],
  "photo": "https://res.cloudinary.com/...",
  "rating": 4.8,
  "totalReviews": 94,
  "clinic": { /* clinic object */ }
}
```

#### Get Available Slots
```http
GET /doctors/:doctorId/slots?date=2026-01-20
```
```json
// Response 200
{
  "doctorId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "date": "2026-01-20",
  "slots": {
    "morning": ["09:00 AM", "09:20 AM", "10:00 AM", "10:40 AM"],
    "afternoon": ["12:00 PM", "12:20 PM", "01:00 PM"],
    "evening": ["04:00 PM", "04:20 PM", "05:00 PM", "06:00 PM"]
  }
}
```

---

### 📅 Appointments

#### Book an Appointment `🔒 Auth Required`
```http
POST /appointments
Authorization: Bearer <token>
```
```json
// Request Body
{
  "doctorId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "clinicId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "date": "2026-01-20",
  "timeSlot": "10:00 AM",
  "notes": "Experiencing occasional chest tightness for 2 weeks"
}

// Response 201
{
  "appointment": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "confirmationNumber": "DNM-20260120-4821",
    "doctor": { "name": "Dr. Priya Sharma" },
    "clinic": { "name": "City Heart Clinic" },
    "date": "2026-01-20",
    "timeSlot": "10:00 AM",
    "status": "confirmed",
    "fee": 800
  },
  "message": "Appointment booked! A WhatsApp confirmation has been sent."
}

// Error Response 409 — Slot already taken
{
  "error": "SLOT_UNAVAILABLE",
  "message": "This slot was just booked. Please choose another time."
}
```

#### Get My Appointments `🔒 Auth Required`
```http
GET /appointments/my?status=upcoming
Authorization: Bearer <token>
```
```json
// Query Params: status = upcoming | past | all

// Response 200
{
  "appointments": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
      "confirmationNumber": "DNM-20260120-4821",
      "doctor": { "name": "Dr. Priya Sharma", "specialization": "Cardiologist" },
      "clinic": { "name": "City Heart Clinic", "address": "42 MG Road..." },
      "date": "2026-01-20",
      "timeSlot": "10:00 AM",
      "status": "confirmed"
    }
  ]
}
```

#### Cancel Appointment `🔒 Auth Required`
```http
PATCH /appointments/:appointmentId/cancel
Authorization: Bearer <token>
```
```json
// Response 200
{
  "message": "Appointment cancelled successfully."
}

// Error 400 — Too close to appointment time
{
  "error": "CANCELLATION_TOO_LATE",
  "message": "Cancellations must be made at least 2 hours before the appointment."
}
```

#### Reschedule Appointment `🔒 Auth Required`
```http
PATCH /appointments/:appointmentId/reschedule
Authorization: Bearer <token>
```
```json
// Request Body
{
  "date": "2026-01-22",
  "timeSlot": "11:00 AM"
}

// Response 200
{
  "message": "Appointment rescheduled successfully.",
  "appointment": { /* updated appointment object */ }
}
```

---

### ⭐ Reviews

#### Submit a Review `🔒 Auth Required`
```http
POST /reviews
Authorization: Bearer <token>
```
```json
// Request Body
{
  "doctorId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "clinicId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "appointmentId": "64f1a2b3c4d5e6f7a8b9c0d4",
  "rating": 5,
  "comment": "Dr. Priya was very thorough and patient. Highly recommend."
}

// Response 201
{
  "message": "Review submitted successfully.",
  "review": { /* review object */ }
}
```

#### Get Doctor Reviews
```http
GET /reviews/doctor/:doctorId?page=1&limit=5
```

---

### 📤 File Uploads

#### Upload Image `🔒 Auth Required`
```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
```
// Form field: file (image/jpeg, image/png, image/webp, max 5MB)

// Response 200
{
  "url": "https://res.cloudinary.com/doctor-near-me/image/upload/v1700000000/photo.jpg",
  "publicId": "doctor-near-me/photo"
}
```

---

### 📊 Error Response Format

All errors follow this consistent structure:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description of what went wrong.",
  "details": [ /* Optional: field-level validation errors */ ]
}
```

| HTTP Code | Meaning |
|---|---|
| 400 | Bad Request (validation failed) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource not found |
| 409 | Conflict (e.g. slot already booked) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

<br/>

## 🤖 WhatsApp Bot

The WhatsApp bot lets any patient book an appointment **without installing an app**, using only WhatsApp. The bot is built as a finite state machine stored in MongoDB.

### Conversation Flow Diagram

```
User messages bot
       │
       ▼
┌─────────────────┐
│   GREETING      │ → Sends language options (EN/HI/MR/GU)
└────────┬────────┘
         │ user picks language
         ▼
┌─────────────────────┐
│  AWAITING_LOCATION  │ → "Please share your location 📍"
└────────┬────────────┘
         │ user shares location
         ▼
┌──────────────────────┐
│   SHOWING_RESULTS    │ → Lists top 5 nearby clinics
└────────┬─────────────┘
         │ user picks clinic
         ▼
┌──────────────────┐
│ SELECTING_DOCTOR │ → Lists doctors at clinic
└────────┬─────────┘
         │ user picks doctor
         ▼
┌─────────────────┐
│ SELECTING_DATE  │ → Next 7 available dates as buttons
└────────┬────────┘
         │ user picks date
         ▼
┌─────────────────┐
│ SELECTING_SLOT  │ → Available time slots (max 10 buttons)
└────────┬────────┘
         │ user picks slot
         ▼
┌──────────────────────┐
│ AWAITING_CONFIRMATION│ → Summary + "Confirm / Cancel" buttons
└────────┬─────────────┘
         │ user confirms
         ▼
┌───────────────┐
│   CONFIRMED   │ → Sends booking details + reference number
└───────────────┘
         │ (session auto-clears after 10 min)
```

### Starting the Bot

Send **any message** to the bot's WhatsApp number:

```
WhatsApp Number: +1 (415) 523-8886
```

Or click this deep link (replace with your number):  
`https://wa.me/14155238886?text=Hello`

### Session State Document (MongoDB)

```json
{
  "phone": "+919876543210",
  "state": "SELECTING_SLOT",
  "language": "hi",
  "location": { "lat": 19.0760, "lng": 72.8777 },
  "selectedClinicId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "selectedDoctorId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "selectedDate": "2026-01-20",
  "lastActiveAt": "2026-01-19T10:30:00.000Z"
}
```

Sessions expire after **30 minutes of inactivity** and restart from GREETING.

---

<br/>

## 🌍 Internationalization (i18n)

The platform supports 4 languages across both the web app and the WhatsApp bot.

| Language | Code | Coverage |
|---|---|---|
| English | `en` | 100% |
| Hindi (हिंदी) | `hi` | 100% |
| Marathi (मराठी) | `mr` | 100% |
| Gujarati (ગુજરાતી) | `gu` | 100% |

### Adding a New Language

1. Create `/client/src/i18n/xx.json` (replace `xx` with your language code).
2. Copy all keys from `en.json` and translate the values.
3. Register it in `/client/src/i18n/index.js`:
   ```javascript
   import xx from './xx.json';
   resources: { en, hi, mr, gu, xx: { translation: xx } }
   ```
4. Add the language option to the `LanguageSwitcher` component.
5. Add translated bot messages to `/server/utils/botFlow.js` under the new language key.

### Sample Translation File Structure

```json
// en.json
{
  "nav": {
    "home": "Home",
    "search": "Search",
    "bookings": "Bookings",
    "profile": "Profile"
  },
  "home": {
    "greeting": "Good {{timeOfDay}}, {{name}}",
    "searchPlaceholder": "Search doctors, clinics...",
    "nearbyTitle": "Clinics Near You",
    "upcomingTitle": "Upcoming Appointments",
    "noAppointments": "No upcoming appointments",
    "bookFirst": "Book your first appointment",
    "whatsappBanner": "Book via WhatsApp"
  },
  "booking": {
    "confirmTitle": "Confirm Appointment",
    "notesPlaceholder": "Any notes for the doctor? (optional)",
    "confirmButton": "Confirm Booking",
    "successTitle": "Appointment Confirmed!",
    "slotTaken": "This slot was just booked. Please choose another time."
  }
}
```

---

<br/>

## 🎨 UI/UX Design System

### Layout Principles

| Rule | Implementation |
|---|---|
| Mobile-first container | `max-w-[480px] mx-auto` — content lives in a phone-width column |
| Desktop "phone frame" | `shadow-2xl border border-zinc-200` on the outer container above 1024px |
| Bottom navigation | `fixed bottom-0` — 4 icons: Home, Search, Bookings, Profile |
| Minimum touch target | 44px height minimum on all interactive elements |
| No horizontal scrolling | `overflow-x-hidden` on the body |

### Color Palette

```
Primary Accent:   #0EA5E9  (sky-500)    — buttons, highlights, active states
Success:          #22C55E  (green-500)  — confirmed status, success states
Warning:          #F59E0B  (amber-500)  — pending status, reminders
Error:            #EF4444  (red-500)    — cancelled status, errors
Background Light: #FFFFFF / #F8FAFC    — white / slate-50
Background Dark:  #09090B / #18181B    — zinc-950 / zinc-900
Text Light:       #18181B              — zinc-900
Text Dark:        #F4F4F5              — zinc-100
Muted:            #71717A              — zinc-500
```

### Page Transition Animation

```javascript
// Every page is wrapped in this Framer Motion config
const pageVariants = {
  initial:  { opacity: 0, x: 20 },
  animate:  { opacity: 1, x: 0 },
  exit:     { opacity: 0, x: -20 },
};
// transition: { duration: 0.25, ease: 'easeInOut' }
```

### Skeleton Loader Pattern

All data-fetching views show animated skeleton placeholders (never blank screens or centered spinners):

```jsx
// Tailwind skeleton block
<div className="animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-xl h-24 w-full" />
```

---

<br/>

## 🚀 Deployment Guide

### Frontend → Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
3. Set framework to **Vite**.
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_GOOGLE_MAPS_KEY=your_production_google_key
   ```
7. Deploy. Vercel auto-deploys on every push to `main`.

### Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub.
2. Select your repo and the `/server` directory.
3. Set start command: `node server.js`
4. Add all your server environment variables in the Railway dashboard.
5. Railway assigns a public URL like `https://your-app.railway.app`.

### Backend → Render (Alternative)

1. Go to [render.com](https://render.com) → New Web Service.
2. Connect your GitHub repo.
3. Set root directory to `server`, build command `npm install`, start command `node server.js`.
4. Add environment variables.

### Post-Deployment Checklist

- [ ] Update `CLIENT_URL` in server `.env` to your Vercel URL.
- [ ] Update `CORS` in `server.js` to only allow your Vercel domain.
- [ ] Update `VITE_API_URL` in client `.env` to your Railway/Render URL.
- [ ] Register production WhatsApp webhook URL in Twilio console.
- [ ] Enable MongoDB Atlas network access for your hosting provider's IPs.
- [ ] Verify HTTPS is enabled (both Vercel and Railway handle this automatically).
- [ ] Test OTP flow, nearby search, booking, and WhatsApp bot end-to-end.

---

<br/>

## 🛡️ Security

### Implemented Security Measures

| Layer | Measure |
|---|---|
| HTTP Headers | `helmet` sets X-Frame-Options, Content-Security-Policy, HSTS, and more |
| Rate Limiting | `express-rate-limit` — OTP endpoint: 3 requests per 15 min per IP |
| Authentication | JWT (15 min expiry) + httpOnly refresh token cookie |
| Authorization | Role-based middleware on every protected route |
| Input Validation | `express-validator` on all POST/PATCH endpoints |
| Passwords | `bcryptjs` with salt rounds = 12 (for admin accounts) |
| File Uploads | Multer restricts to image MIME types and 5MB max size |
| CORS | Configured to only allow the production frontend domain |
| Secrets | All API keys stored in `.env`, excluded from Git |

### Rate Limits

| Endpoint | Limit |
|---|---|
| `POST /auth/request-otp` | 3 requests / 15 min / IP |
| `POST /auth/verify-otp` | 5 attempts / 15 min / IP |
| `POST /appointments` | 10 bookings / hour / user |
| All other routes | 100 requests / 15 min / IP |

---

<br/>

## 🗺️ Roadmap

### ✅ v1.0 — Core Platform (Current)
- [x] OTP authentication
- [x] Geolocation clinic search
- [x] Doctor profiles with real-time slot availability
- [x] Appointment booking with race condition prevention
- [x] WhatsApp booking bot
- [x] Light / Dark mode
- [x] 4-language support
- [x] Real-time Socket.io notifications
- [x] Automated appointment reminders

### 🔄 v1.1 — In Progress
- [ ] Video consultation support (WebRTC)
- [ ] In-app payments (Razorpay / Stripe)
- [ ] Patient medical history / EHR notes
- [ ] Doctor availability calendar management

### 📋 v2.0 — Planned
- [ ] AI symptom checker (pre-booking triage)
- [ ] Lab test and prescription upload
- [ ] Insurance integration
- [ ] Clinic admin iOS/Android app
- [ ] Telegram bot parity with WhatsApp bot
- [ ] More language support (Tamil, Telugu, Kannada)

---

<br/>

## 🤝 Contributing

Contributions are what make open source amazing. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork** the project.
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m 'feat: Add AmazingFeature'
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**.

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use For |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code formatting (no logic change) |
| `refactor:` | Code restructuring |
| `test:` | Adding or fixing tests |
| `chore:` | Build or tooling changes |

### Reporting Bugs

Open a [GitHub Issue](../../issues) with:
- The steps to reproduce the bug
- What you expected to happen
- What actually happened
- Your OS, Node.js version, and browser

---

<br/>

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full text.

---

<br/>

<div align="center">

Built with ❤️ by the **Doctor Near Me** Team

**[⬆ Back to Top](#-doctor-near-me)**

<br/>

[![Star this repo](https://img.shields.io/github/stars/your-username/doctor-near-me?style=social)](https://github.com/your-username/doctor-near-me)
[![Follow on GitHub](https://img.shields.io/github/followers/your-username?style=social)](https://github.com/your-username)

</div>