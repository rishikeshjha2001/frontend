# HappyLokam Web Frontend

Modern Next.js 14 web application for HappyLokam customer portal, partner onboarding, and admin dashboard.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion
- **Icons**: Lucide React
- **Payments**: Razorpay Checkout SDK
- **3D & Visualizations**: Three.js & React Three Fiber

## Project Structure
- `happylokam-web/`: Primary Next.js application codebase
  - `src/app/`: Next.js App Router routes and pages (Customer, Partner, Admin, Manager)
  - `src/components/`: Reusable UI components, modals, and navigation
  - `public/`: Static assets, branding icons, and imagery

## Getting Started

1. Navigate to the web project:
   ```bash
   cd happylokam-web
   ```

2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm run start
   ```
