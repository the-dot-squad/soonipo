# 🚀 Soon IPO

[![Live Demo](https://img.shields.io/badge/live-soonipo.com-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://soonipo.com)
[![Version 0.2.4](https://img.shields.io/badge/version-v0.2.4-blue?style=for-the-badge)](https://github.com/the-dot-squad/soonipo/releases)
[![License MIT](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](https://github.com/the-dot-squad/soonipo/blob/main/LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind%20CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**Soon IPO** is a modern web application for tracking upcoming Initial Public Offerings (IPOs) and analyzing real-time performance of newly public companies.

🔗 **Live Site:** [soonipo.com](https://soonipo.com)

---

## 📊 Key Features

- 📅 **Upcoming IPO Tracker** — Comprehensive table of upcoming market debuts with expected offer dates, price ranges, shares offered, and company sectors.
- 📈 **Market Pulse** — Live benchmark index overviews (S&P 500, Nasdaq, Dow Jones) featuring **1D / 1W / 1Y** historic ranges and sparkline charts.
- 🕓 **Historical IPO Insights** — Detailed record of recently priced IPOs with direct access to live stock quotes and market data.
- 🧩 **Interactive Price Charts** — Sidebar integration with **Recharts** for real-time price trend visualization powered by Yahoo Finance.
- 🔐 **Hardened API Security** — Centralized proxy security layer featuring origin validation, HTTP method restrictions, rate limiting, and Bearer token protected cron endpoints.
- 🌓 **Dynamic Theme Engine** — Seamless light and dark mode with system theme detection via `next-themes` and `shadcn/ui` primitives.
- ⚡ **Optimized Performance & SEO** — Built with Next.js App Router, Turbopack, dynamic metadata, sitemap generation, and Vercel Analytics.

---

## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| **Framework & Core** | [Next.js 16](https://nextjs.org) (App Router), [React 19](https://react.dev), [Framer Motion](https://framer.com/motion) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) primitives, `next-themes` |
| **Database & ORM** | [MongoDB](https://www.mongodb.com), [Mongoose 9](https://mongoosejs.com) |
| **Data Engine** | [Yahoo Finance API](https://github.com/gregor-md/yahoo-finance2) (`yahoo-finance2`), `dayjs` |
| **Visualization** | [Recharts 3](https://recharts.org), Lucide Icons |
| **Security & Analytics** | Custom Proxy Guard, Rate Limiter, [Vercel Analytics](https://vercel.com/analytics) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x (LTS recommended)
- **npm**, **pnpm**, or **yarn**
- **MongoDB** cluster (e.g., MongoDB Atlas or local instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/the-dot-squad/soonipo.git
   cd soonipo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**  
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

   # Bearer token for protecting automated IPO sync routes
   CRON_SECRET=your_secure_random_cron_secret

   # Base Application URL
   NEXT_PUBLIC_BASE_URL=https://soonipo.com
   ```

---

## 💻 Development & Operations

### Run Local Dev Server

Launch the development server with Turbopack acceleration:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Data Refresh (Local Cron Test)

Trigger the IPO synchronization pipeline manually using your configured `CRON_SECRET`:
```bash
curl -X GET http://localhost:3000/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Code Quality & Linting

Run ESLint checks across the codebase:
```bash
npm run lint
```

---

## 🔐 API Security Layer

The application incorporates a centralized security middleware guarding `/api/*` routes:

- **Browser Protection**: Rejects unauthorized cross-origin requests via `Origin` and `Sec-Fetch-Site` header checks.
- **HTTP Method Restrictions**: Enforces read-only access (`GET`, `HEAD`, `OPTIONS`) on public endpoints.
- **Rate Limiting**: Protects backend resources against request flooding and abuse.
- **Security Headers**: Injects defensive HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- **Cron Protection**: Restricts automated data synchronization endpoints to authorized Bearer tokens (`CRON_SECRET`).

---

## 🏗️ Production

Build the optimized application bundle and start the production server:

```bash
npm run build
npm start
```

---

## 👥 Maintainers

- **Davod Mozafari** ([@davodm](https://github.com/davodm))

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open an issue or submit a pull request on the [GitHub Repository](https://github.com/the-dot-squad/soonipo/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
