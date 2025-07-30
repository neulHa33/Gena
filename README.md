# Gena Dashboard

A modern, AI-powered dashboard application built with Next.js, TypeScript, Tailwind CSS, and Chart.js. This project demonstrates advanced frontend development capabilities with real-time data visualization and interactive dashboard management.

## 🚀 Features

### Core Functionality
- **📊 Multiple Dashboards:** Create, view, edit, and manage multiple dashboards with unique configurations
- **📈 Rich Chart Types:** Support for number displays, bar charts, line charts, pie charts, doughnut charts, radar charts, polar area charts, and area charts
- **🎯 Drag-and-Drop Interface:** Intuitive drag-and-drop functionality for chart reordering and layout management
- **🎨 Dark/Light Theme:** Seamless theme switching with persistent user preferences
- **📱 Responsive Design:** Fully responsive interface that works across all device sizes

### Advanced Features
- **🔧 Chart Configuration:** Customize chart types, titles, and colors
- **📋 Context Menu:** Right-click context menu for quick chart actions (edit, delete, enlarge)
- **📄 PDF Export:** Export dashboards to PDF with proper theme support
- **⚡ Real-time Updates:** Live data updates and automatic layout persistence
- **🎭 Fullscreen Mode:** Enlarge charts for detailed analysis

## 🛠️ Tech Stack

### Frontend Framework
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Grid Layout](https://react-grid-layout.github.io/react-grid-layout/)** - Responsive grid system
- **[React Resizable](https://github.com/react-grid-layout/react-resizable)** - Resizable components

### Data Visualization
- **[Chart.js](https://www.chartjs.org/)** - Flexible charting library
- **[React Chart.js 2](https://react-chartjs-2.js.org/)** - React wrapper for Chart.js
- **[Chart.js Data Labels](https://github.com/chartjs/chartjs-plugin-datalabels)** - Data label plugin

### Utilities
- **[html2canvas](https://html2canvas.hertzen.com/)** - HTML to canvas conversion for PDF export
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation library
- **[UUID](https://github.com/uuidjs/uuid)** - Unique identifier generation

## 📁 Project Structure

```
gena-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes (mock backend)
│   │   │   ├── charts/        # Chart management endpoints
│   │   │   ├── dashboards/    # Dashboard management endpoints
│   │   │   └── data/          # Mock data endpoints
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── [id]/         # Individual dashboard view
│   │   │   └── create/       # Dashboard creation
│   │   ├── globals.css       # Global styles and animations
│   │   ├── layout.tsx        # Root layout component
│   │   └── page.tsx          # Homepage
│   ├── components/            # Reusable React components
│   │   ├── ChartRenderer.tsx # Chart rendering component
│   │   ├── DarkModeToggle.tsx # Theme toggle component
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   └── ...               # Other UI components
│   ├── lib/                  # Utility libraries
│   │   └── db.ts            # Mock database logic
│   └── types/                # TypeScript type definitions
│       └── dashboard.ts      # Dashboard and chart types
├── public/                   # Static assets
├── Dockerfile               # Production Docker configuration
├── Dockerfile.dev           # Development Docker configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## 🧪 API Endpoints

### Dashboard Management
- `GET /api/dashboards` - Retrieve all dashboards
- `POST /api/dashboards` - Create new dashboard
- `GET /api/dashboards/:id` - Get specific dashboard
- `PUT /api/dashboards/:id` - Update dashboard (rename, description)
- `DELETE /api/dashboards/:id` - Delete dashboard

### Chart Management
- `GET /api/charts` - Retrieve all charts
- `POST /api/charts` - Create new chart with positioning
- `GET /api/charts/:id` - Get specific chart
- `PUT /api/charts/:id` - Update chart configuration
- `DELETE /api/charts/:id` - Delete chart

### Mock Data Sources
- `GET /api/data/total_revenue` - Revenue metrics
- `GET /api/data/orders_over_time` - Time-series order data
- `GET /api/data/signups_by_region` - Regional signup data
- `GET /api/data/user_growth_by_month` - Monthly user growth
- `GET /api/data/conversion_rate_over_time` - Conversion rate trends
- `GET /api/data/page_views_by_category` - Category-based page views

## 🖥️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd gena-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

#### Production Build
```bash
# Build production image
docker build -t gena-dashboard .

# Run container
docker run -p 3000:3000 gena-dashboard
```

#### Development Build
```bash
# Build development image
docker build -f Dockerfile.dev -t gena-dashboard:dev .

# Run with volume mounting
docker run -p 3000:3000 -v $(pwd):/app gena-dashboard:dev
```

## ✨ Usage Guide

### Dashboard Management
1. **Create Dashboard:** Click "Create New Dashboard" on homepage
2. **Rename Dashboard:** Use the rename button in the sidebar
3. **Delete Dashboard:** Use the delete button in the sidebar

### Chart Management
1. **Add Chart:** Click "Add Chart" button in dashboard view
2. **Configure Chart:** Select chart type, title, data source, and color
3. **Edit Chart:** Click edit button or right-click for context menu
4. **Delete Chart:** Click delete button or use context menu
5. **Enlarge Chart:** Click on chart or use context menu

### Layout Management
1. **Drag Charts:** Click and drag charts to reposition
2. **Resize Charts:** Use resize handles to adjust chart size
3. **Auto-save:** Layout changes are automatically saved

### Theme & Export
1. **Switch Theme:** Use the theme toggle in the navigation
2. **Export PDF:** Click "Export PDF" button for dashboard export

## 🚀 Performance Optimizations

### React Optimizations
- **React.memo** for component memoization
- **useCallback** for event handler optimization
- **useMemo** for expensive computations
- **Optimized re-renders** with proper dependency arrays

### Build Optimizations
- **Standalone output** for optimal Docker deployment
- **Package import optimization** for Chart.js libraries
- **Tree shaking** for reduced bundle size
- **Code splitting** for faster initial loads

### Docker Optimizations
- **Multi-stage builds** for smaller production images
- **Alpine Linux** for minimal attack surface
- **Non-root user** for security
- **Layer caching** for faster builds

## 🧪 Testing

### Development Testing
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Docker Testing
```bash
# Test production build
docker build -t gena-dashboard-test .

# Test development build
docker build -f Dockerfile.dev -t gena-dashboard-dev .
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables
- `NODE_ENV` - Environment mode (development/production)
- `NEXT_TELEMETRY_DISABLED` - Disable Next.js telemetry
- `PORT` - Server port (default: 3000)

### Next.js Configuration
- **Standalone output** for Docker deployment
- **Package import optimization** for better performance
- **Experimental features** for enhanced capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Icons from [Heroicons](https://heroicons.com/)

---

**Last Updated:** July 27, 2025