# QueueLess — AI Enhanced Digital Queue and Smart Token Management System

> **MERN Stack Project** | Node.js · Express · MongoDB · React · Vite

---

## 📌 Problem Being Solved

Physical waiting lines at service counters (hospitals, banks, government offices, universities) are inefficient, opaque, and frustrating. Customers have no visibility into queue position or estimated wait time, and counter operators cannot intelligently dispatch the next customer.

**QueueLess** eliminates physical queues by replacing them with a digital token system backed by a structured multi-tier priority algorithm, appointment scheduling, and a data pipeline prepared for future AI/ML wait-time prediction.

---

## ✨ Main Features

| Feature | Status |
|---|---|
| Customer registration & JWT authentication | ✅ Implemented |
| Walk-in digital token generation (Priority P2) | ✅ Implemented |
| Appointment booking with slot reservation (Priority P1) | ✅ Implemented |
| Late appointment check-in (Priority P3) | ✅ Implemented |
| P1 → P2 → P3 priority scheduling with FIFO tie-breaking | ✅ Implemented |
| Estimated waiting time calculation (algorithmic) | ✅ Implemented |
| Admin live queue orchestration & token dispatching | ✅ Implemented |
| Counter desk management (open/close/assign service) | ✅ Implemented |
| Service desk CRUD management (admin) | ✅ Implemented |
| Analytics overview (throughput, no-shows) | ✅ Foundation Ready |
| Real-time WebSocket queue updates (Socket.IO) | 🔲 Phase 2 |
| QR code generation & kiosk scanning check-in | 🔲 Phase 2 |
| Push/SMS/Email notifications | 🔲 Phase 2 |
| AI/ML waiting-time prediction model | 🔲 Phase 3 |

---

## 🛠️ Technology Stack

**Frontend**
- React 19 + Vite 8
- React Router DOM v7
- Axios (centralized HTTP service layer)
- Vanilla CSS (custom design system — no Tailwind/Bootstrap)

**Backend**
- Node.js (ESM modules)
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) Authentication
- bcryptjs (password hashing)
- Joi (request validation)
- Helmet, CORS, express-rate-limit (security)
- Morgan (HTTP logging)

---

## 📁 Project Architecture

```
QueueLess/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── assets/            # Static images, icons
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Button, Input, Modal, Loader, etc.
│   │   │   ├── auth/          # LoginForm, RegisterForm, route guards
│   │   │   ├── customer/      # ServiceCard, TokenCard, WaitingTimeCard
│   │   │   ├── admin/         # Sidebar, AdminHeader, QueueTable, StatCard
│   │   │   ├── queue/         # LiveQueueView
│   │   │   ├── token/         # TokenBadge
│   │   │   ├── appointment/   # AppointmentCard
│   │   │   ├── service/       # ServiceList
│   │   │   └── layout/        # Navbar, Footer
│   │   ├── pages/
│   │   │   ├── public/        # Home, NotFound, Unauthorized
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── customer/      # Dashboard, Services, Tokens, Queue, etc.
│   │   │   └── admin/         # Dashboard, LiveQueue, Services, Analytics
│   │   ├── layouts/           # PublicLayout, AuthLayout, CustomerLayout, AdminLayout
│   │   ├── routes/            # AppRoutes, ProtectedRoute, RoleRoute
│   │   ├── services/          # Axios API service layer (per domain)
│   │   ├── hooks/             # useAuth
│   │   ├── context/           # AuthContext
│   │   ├── utils/             # storage.js, formatters.js
│   │   ├── constants/         # roles, tokenStatus, priorityLevels, routes
│   │   └── styles/            # variables.css, global.css, layout.css, etc.
│   └── package.json
│
└── server/                    # Node.js + Express REST API
    └── src/
        ├── config/            # env.js, db.js
        ├── controllers/       # Thin HTTP handlers
        ├── services/          # Business logic layer
        ├── models/            # Mongoose schemas
        ├── routes/            # Express routers
        ├── middleware/        # Auth, role, validate, error, rate-limit
        ├── validators/        # Joi schemas
        ├── utils/             # ApiError, asyncHandler, response, logger, generateToken
        ├── constants/         # roles, tokenStatus, priorityLevels, appointmentStatus
        ├── sockets/           # Socket.IO foundation (socket.js)
        └── jobs/              # Background job stubs (queueJobs.js)
```

---

## 🚀 How to Install

```bash
# 1. Clone the repository
git clone <your-repo-url> QueueLess
cd QueueLess

# 2. Install all dependencies
npm run install:all
```

Or individually:
```bash
cd server && npm install
cd ../client && npm install
```

---

## ▶️ How to Run

### Frontend (React + Vite)
```bash
cd client
npm run dev
```
Opens at **http://localhost:5173**

### Backend (Node + Express)
```bash
cd server
npm run dev
```
Runs at **http://localhost:5000**

Health check: `GET http://localhost:5000/api/v1/health`

---

## 🔐 Environment Variables

### `server/.env` (copy from `server/.env.example`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/queueless
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
LOG_LEVEL=info
```

### `client/.env` (copy from `client/.env.example`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 📊 Priority Queue Business Rules

| Priority | Label | Trigger |
|---|---|---|
| **P1** | On-Time Appointment | Arrival ≤ 15 minutes after scheduled slot |
| **P2** | Walk-In | Standard same-day walk-in token |
| **P3** | Late Appointment | Arrival > 15 minutes past scheduled slot |

Within the same priority tier, customers are served in strict **FIFO order** based on `checkInTime`.

**Waiting Time Formula (Current):**
```
estimatedWaitMinutes = customersAhead × service.avgServiceTime
```

---

## 🧠 Future AI/ML Extension (Phase 3)

The `waitingTimeService.js` is intentionally designed as a **replaceable calculation module**. The current linear formula will be swapped or augmented with an ML regression model (e.g. gradient boosting on historical `checkInTime`, `calledAt`, `servedAt`, counter staffing levels, and time-of-day features) without breaking any API contracts.

Every completed token already stores the exact timestamps needed for model training.

---

## ✅ Current Implementation Status

**Working:**
- React frontend starts and routes correctly
- JWT register/login with role-based access control
- Full P1/P2/P3 priority queue logic
- Token lifecycle (WAITING → IN_SERVICE → COMPLETED)
- Appointment booking and check-in with automatic priority assignment
- Admin live queue orchestration UI
- Service and counter CRUD (admin)
- Analytics foundation (token counts, throughput rate)
- Health endpoint (`/api/v1/health`)
- Centralized error handling and response formatting

**Architecture Foundation (Not Yet Active):**
- Socket.IO real-time event constants defined in `sockets/socket.js`
- QR code service scaffold in `services/qrService.js`
- Notification service stub in `services/notificationService.js`
- Background queue job runner in `jobs/queueJobs.js`

---

## 📖 API Reference (v1)

| Method | Endpoint | Auth |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Public |
| `POST` | `/api/v1/auth/login` | Public |
| `GET` | `/api/v1/auth/me` | JWT |
| `GET` | `/api/v1/services` | Public |
| `POST` | `/api/v1/services` | Admin |
| `POST` | `/api/v1/tokens/walk-in` | JWT |
| `POST` | `/api/v1/tokens/check-in` | JWT |
| `GET` | `/api/v1/tokens/my` | JWT |
| `GET` | `/api/v1/queue/:serviceId/live` | Public |
| `POST` | `/api/v1/queue/call-next` | Admin |
| `GET` | `/api/v1/analytics/overview` | Admin |
| `GET` | `/api/v1/health` | Public |
