# 🚀 Soon IPO

**Soon IPO** is a platform that tracks upcoming initial public offerings and delivers real-time insights on recently priced stocks. Built with **Next.js 15** and optimized for performance, Soon IPO makes it easy to stay ahead of market trends.

🔗 Live site: [https://soonipo.com](https://soonipo.com)

---

## 📊 Key Features

- 📅 **Upcoming IPO Tracker** – Stay updated with filing dates and pricing windows.
- 💰 **Priced Stock Insights** – View performance trends after IPO pricing.
- ⚙️ **Dynamic Data Caching** – Intelligent cache system to avoid redundant data calls.
- ⏱️ **Scheduled Updates** – Cron-based jobs ensure data stays current without overfetching.

---

## 🧰 Tech Stack

- **Next.js 15 (App Router)**
- **Tailwind CSS**
- **Node.js 18+**
- **MongoDB** for metadata storage
- [**Finnhub API**](https://finnhub.io/) for ipo calendar data.
- [**Yahoo Finance API**](https://www.npmjs.com/package/yahoo-finance2) for stock data.

---

## 🛠️ Installation

```bash
git clone https://github.com/volantmedia/soonipo.git
cd soonipo
npm install
```

## 💻 Development

```bash
npm run dev
```
Access it at http://localhost:3000.

## 🏗️ Production Build
```bash
npm run build
npm start
```

## 🧪 Code Quality

Lint the codebase with ESLint:
```bash
npm run lint
```
Format files with Prettier:
```bash
npm run format
```

## 🌿 Git Workflow
- `main` – Stable, deployable branch

- `dev` – Main development line

- `feat/*`, `fix/*` – Individual work branches merged via PRs

- Follow Conventional Commits for all commit messages.

## 📜 License
This project is licensed under the GNU GPLv3 License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Maintainers
Developed by [Dot Squad](https://dotsquad.net), a team of passionate developers dedicated to creating innovative solutions.

## 🤝 Contributing
We welcome contributions! Please fork the repository and submit a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.
