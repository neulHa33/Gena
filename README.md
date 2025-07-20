# 📊 Gena Dashboard App

This is a mock dashboard application built with **Next.js**, **TypeScript**, and **Tailwind CSS** as a take-home assignment for **Gena**.

It allows users to create dashboards and add various types of charts with customizable titles and data sources. All data is persisted locally using **LowDB**.

---

## 🔧 Tech Stack

- **Next.js (Pages Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Chart.js**
- **LowDB** (for local JSON-based persistence)

---

## ✨ Features

### 📁 Dashboard Management
- View all dashboards on the home page
- Create a new dashboard with a custom name (via prompt)
- Navigate to the dashboard detail page upon creation
- Dashboards are saved in `db.json` and persist between server restarts

### 📈 Chart Management
- Add charts to each dashboard
- Supported chart types: `number`, `bar`, and `line`
- Charts include a title and a data endpoint
- Chart state is stored per dashboard and saved to disk

### 🧠 UX Enhancements
- Loading state during dashboard creation (e.g., "Creating...")
- Friendly message when no dashboards exist
- Prompt input for dashboard name

---

## 🗂 Folder Structure
```
gena-dashboard/
├── components/
│ └── Chart.tsx
├── lib/
│ └── db.ts
├── pages/
│ ├── index.tsx // Home page: dashboard list & creation
│ ├── dashboard/[id].tsx // Dashboard detail with chart management
│ └── api/
│ ├── dashboards/
│ │ ├── index.ts // GET & POST dashboards
│ │ └── [id].ts // GET dashboard by ID
│ └── charts.ts // POST new chart
├── db.json // LowDB local database
```


---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 📌 How It Works
- All data (dashboards and charts) is stored in db.json using lowdb
- On each API call, lib/db.ts reads and writes to the file
- This simulates a simple backend storage without a real database
- Charts are rendered dynamically using Chart.js

---
## 🔮 Future Improvements
- Chart editing and deletion
- Drag-and-drop chart reordering
- Responsive layout for mobile
- Authentication with Firebase or Auth.js

---
## 🧑‍💻 Author
Created by Haneul Mun for the Gena Frontend Engineer take-home assignment.
Feel free to explore and run the project locally!
