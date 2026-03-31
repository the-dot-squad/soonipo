# 🚀 Soon IPO

**Soon IPO** is a modern web application for tracking upcoming Initial Public Offerings (IPOs) and analyzing recently priced stocks in real time.  
Built with **Next.js 16**, **React 19**, and a **MongoDB** backend, it delivers a fast, responsive experience for investors, analysts, and finance enthusiasts.

🔗 **Live site:** [soonipo.com](https://soonipo.com)

---

## 📊 Key Features

- 🔍 **IPO Tracking** — Browse upcoming IPOs with key details (symbol, company, sector, offer date, price range, and more).
- 📈 **Market Pulse** — U.S. index overview (open, change, % change) with **1D / 1W / 1Y** ranges, **sparkline** charts, and Yahoo chart–backed data.
- 🕓 **Past IPOs Tab** — Historical IPOs; click a row to load **live market data** for priced tickers.
- 🌍 **Live Stock Data** — Integrates **Yahoo Finance** (quotes and chart history) where the symbol is available; graceful handling when data is missing.
- 🧩 **Detail View** — IPO specifics and a **price chart** in the sidebar when a symbol has live data.
- 🌓 **Light & Dark Mode** — Theme toggle via **next-themes**; polished layout with **Tailwind CSS 4** and **shadcn-style** UI primitives.
- 🔎 **Search** — Client-side IPO search across the list.
- 🗄 **MongoDB** — IPO records stored in MongoDB via **Mongoose**; API routes for reads and cron-style refresh.
- 🚀 **SEO** — Sitemap, robots, and metadata tuned for discoverability.
- 📱 **Responsive** — Works on desktop and mobile.

---

## 🧰 Tech Stack

| Area        | Technologies |
|-------------|--------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Styling**   | Tailwind CSS 4, **shadcn/ui**-style components |
| **Database**  | MongoDB + Mongoose |
| **Data**      | Yahoo Finance API (`yahoo-finance2`), server-side fetching |
| **Analytics** | Vercel Analytics |
| **Tooling**   | ESLint (flat config), Turbopack dev |

---

## 🛠️ Installation

### Prerequisites

- **Node.js** (LTS recommended)
- **npm**, **yarn**, or **pnpm**
- A running **MongoDB** instance and connection string

### Clone & install

```bash
git clone https://github.com/davodmozafari/soonipo.git
cd soonipo
npm install
```

### Environment

Create a `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER_HOSTNAME/DATABASE_NAME
CRON_SECRET=your_long_random_secret   # optional: protects POST /api/cron from strangers
```

Use a **database user with read/write** access (not the Atlas admin account).

---

## 💻 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
The dev server uses **Turbopack** (`next dev --turbopack`).

### Cron / IPO refresh (local)

If you use `CRON_SECRET`, refresh the IPO collection with:

```bash
curl -X POST http://localhost:3000/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 🏗️ Production Build

```bash
npm run build
npm start
```

Deploy on **Vercel** (or any Node host): set `MONGODB_URI` (and `CRON_SECRET` if you lock `/api/cron`) in the project environment. Optional: schedule a hit to `/api/cron` with the bearer token.

---

## 🧪 Code Quality

```bash
npm run lint
```

---

## 👥 Maintainers

- [@davodmozafari](https://github.com/davodmozafari)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.  
Feel free to check the [issues page](https://github.com/davodmozafari/soonipo/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
