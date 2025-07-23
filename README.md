# Gena Dashboard

A modern, full-featured dashboard web app built with Next.js, TypeScript, Tailwind CSS, and Chart.js. This project is a take-home assignment for a Frontend Engineer interview at Gena.

## 🚀 Features

- **Multiple Dashboards:** Create, view, and rename multiple dashboards.
- **Charts:** Add number, bar, and line charts to dashboards. Configure chart type, title, and data source.
- **Drag-and-Drop:** Reorder charts within a dashboard using drag-and-drop.
- **Mock API:** All data is served via Next.js API routes with an in-memory mock database.
- **Modern UI:** Clean, white, and responsive design using Tailwind CSS.

## 🛠️ Tech Stack

- [Next.js (App Router)](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (drag-and-drop)

## 📁 Project Structure

```
src/
  app/
    api/                # Next.js API routes (mock backend)
    dashboard/[id]/     # Dashboard page (charts, drag-and-drop)
    page.tsx            # Homepage (dashboard list, create, rename)
    layout.tsx          # App layout
    globals.css         # Global styles
  components/           # Reusable React components (e.g., ChartRenderer)
  lib/                  # Mock DB logic
  types/                # TypeScript types
  styles/               # (Optional) Custom styles
```

## 🧪 Mock API Endpoints

- `GET /api/dashboards` — List dashboards
- `POST /api/dashboards` — Create dashboard
- `GET /api/dashboards/:id` — Get dashboard
- `PUT /api/dashboards/:id` — Update dashboard (rename, reorder charts)
- `DELETE /api/dashboards/:id` — Delete dashboard (not implemented by default)
- `GET /api/charts` — List charts
- `POST /api/charts` — Create chart
- `GET /api/charts/:id` — Get chart
- `PUT /api/charts/:id` — Update chart
- `DELETE /api/charts/:id` — Delete chart
- Chart data endpoints:
  - `/api/data/total_revenue` — `{ value: 98123 }`
  - `/api/data/orders_over_time` — `{ labels: [...], values: [...] }`
  - `/api/data/signups_by_region` — `{ labels: [...], values: [...] }`

## 🖥️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## ✨ Usage

- **Create a dashboard:** Use the form on the homepage.
- **Rename a dashboard:** Click the "Rename" button next to a dashboard.
- **Add charts:** Go to a dashboard, fill out the chart form, and add.
- **Reorder charts:** Drag and drop charts to reorder them. Order is saved automatically.

## 📦 Optional Improvements

- Dashboard deletion
- Mobile responsiveness
- Docker support
- More chart types and data endpoints

## 📄 License

MIT — for interview/demo purposes only.
