# QueueLess Frontend Client

React + Vite frontend for **QueueLess — AI Enhanced Digital Queue and Smart Token Management System**.

## Architectural Highlights

- **Vite & React 19**: Ultra-fast hot module replacement (HMR) and optimized build bundling.
- **Pure Vanilla CSS Design System**: Custom HSL tokens, dark/light contrast palettes, typography scaling, responsive grid layouts, and zero heavy UI library overhead.
- **Modular Directory Organization**:
  - `components/`: Domain-isolated components (`common/`, `auth/`, `customer/`, `admin/`, `queue/`, `token/`, `appointment/`, `service/`, `layout/`).
  - `layouts/`: Structure persistence (`PublicLayout`, `AuthLayout`, `CustomerLayout`, `AdminLayout`).
  - `routes/`: Protected routes and role guards (`ProtectedRoute`, `RoleRoute`).
  - `services/`: Centralized Axios communication layer with JWT interceptors.
  - `context/`: Lightweight global state via `AuthContext` and `useAuth` hook.
  - `styles/`: Clean separation of `variables.css`, `global.css`, `layout.css`, `components.css`, and `responsive.css`.

## Running the Client

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.
