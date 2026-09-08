# PartnerPlus — Cooperative Gig Services Platform (Co-opConnect AI)

> **Smart India Hackathon (SIH) Project**  
> *"Transforming traditional labor cooperatives into intelligent, AI-powered digital workforce networks."*

[![Live Production Demo](https://img.shields.io/badge/Production%20Demo-PartnerPlus%20Live-059669?style=for-the-badge&logo=vercel)](https://partnerplus-two.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20Vite%206%20%7C%20Supabase%20%7C%20Tailwind%20v4-0284C7?style=for-the-badge)](https://partnerplus-two.vercel.app)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%202.4-8B5CF6?style=for-the-badge&logo=google)](https://partnerplus-two.vercel.app)

---

## 🌟 Executive Summary

**PartnerPlus (Co-opConnect AI)** is a cooperative-first digital marketplace connecting customers, verified cooperative gig workers, and cooperative administrators. Private gig aggregators exploit gig workers with 25–30% commission rates and zero social security. PartnerPlus empowers existing **Labour Cooperative Societies** with digital infrastructure, AI-driven worker matching, predictive demand forecasting, digital skill passports, and automated worker welfare fund management.

---

## 👥 Team & Pitch Roles

| Team Member | Pitch Specialization & Role | Key Focus Area |
| :--- | :--- | :--- |
| **Kapilan Kannan Raaja Raajen** | AI & Overall Problem | Emergency service booking & multi-factor AI matching |
| **Jeshna Sree** | All Areas of Hackathon | End-to-end user journeys (Customer, Worker, Admin) |
| **Deshna G** | Research & User Needs | Ecosystem gaps, trust factors & worker accessibility |
| **Vijay Krishna M** | Technical Architecture | System modules, Supabase RLS security & AI engines |
| **Udhay** | Domain Expertise | Cooperative workforce utilization & governance |
| **Subainthar** | Existing Solutions & USP | Aggregator differentiation, PMSBY welfare & rate cards |

---

## 🚀 Key Features & Stakeholder Portals

### 1. 🛍️ Customer Portal
- **Instant & Scheduled Service Booking**: Plumbers, electricians, carpenters, painters, drivers, caregivers, appliance repair, masons, pest control, AC technicians.
- **1-Tap Emergency Booking**: Dedicated emergency dispatch mode for urgent pipeline leaks or sparking switchboards.
- **Transparent Cooperative Pricing**: Non-surge rate guidelines backed by cooperative standards.
- **Razorpay UPI Integration**: Secure direct payment gateway.

### 2. 👷 Worker Portal & Digital Skill Passport
- **Digital Skill Passport**: Verified skills, NSDC / ITI trade certifications, police clearance badges, and customer ratings.
- **WebRTC Camera QR Scanner**: On-site arrival check-in with 4-digit PIN fallback.
- **Worker Welfare Tab**: Live tracking of PMSBY insurance scheme balance and cooperative welfare fund contributions.
- **Hands-Free Voice Mode**: Multilingual voice assistance in Tamil, Hindi, and English.

### 3. 🏢 Cooperative Administrator Portal
- **Centralized Workforce Management**: Worker registration, verification, and badge approvals.
- **Live GPS Dispatch Map**: Real-time worker tracking and active job monitoring.
- **Predictive Demand Forecasting**: AI hotspot alerts for regional worker allocation.
- **Welfare Reserve Governance**: Transparent monitoring of society earnings and worker welfare distribution.

### 4. 💼 Enterprise / Organization Portal
- **B2B Bulk Workforce Deployment**: Commercial contract booking for office maintenance, construction sites, and municipal projects.

---

## 🧠 Core Algorithms & Technical Innovations

### 1. AI Multi-Criteria Decision Making (MCDM) Worker Matching
Calculates a multi-factor weighted ranking score considering skill compatibility, GPS distance, customer rating, trade experience, verification badges, and active workload penalty to ensure equitable earning distribution across all cooperative members.

### 2. Haversine Great-Circle Proximity Algorithm
Calculates precise spherical distances between customer addresses and worker device GPS coordinates.

### 3. Predictive Demand Forecasting Algorithm
Analyzes historical booking volume and seasonal multipliers to output recommended worker deployments for local neighborhood hotspots.

### 4. Transparent Revenue Split & Welfare Allocation Model
- **90%** Direct Worker Net Payout
- **5%** Cooperative Worker Welfare & Health Insurance Fund (PMSBY)
- **5%** Cooperative Administrative Reserve
- **₹0** Platform Convenience Fees

---

## 🛠️ Complete Tech Stack

- **Frontend**: React 19, Vite 6, TypeScript 5.8, Tailwind CSS v4, Lucide React, Framer Motion, Canvas Confetti.
- **Backend & Database**: Supabase PostgreSQL 15+, Express 4, TSX middleware.
- **Security**: PostgreSQL Row Level Security (RLS) Migration 012 (`is_admin_or_staff()`).
- **AI / ML**: `@google/genai` (Google Gemini 2.4 SDK) for multilingual voice and chat intent classification.
- **Hardware & Web APIs**: HTML5 WebRTC Video Stream API, HTML5 Geolocation API, Web Speech API.
- **Integrations**: Razorpay Web SDK, WhatsApp Cloud API gateway.

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/vijaykrishna220077/partnerplus.git
cd partnerplus

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Run development server
npm run dev
```

---

## 🌐 Live Production Link

🔗 **Vercel Production Deployment**: [https://partnerplus-two.vercel.app](https://partnerplus-two.vercel.app)

