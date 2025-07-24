"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import ChartRenderer from "../../../components/ChartRenderer";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from "next/link";
import DarkModeToggle from "../../../components/DarkModeToggle";
import Sidebar from "../../../components/Sidebar";

interface Chart {
  id: string;
  dashboardId: string;
  type: "number" | "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea" | "area";
  title: string;
  dataEndpoint: string;
  color?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

interface Dashboard {
  id: string;
  name: string;
  charts: Chart[];
  createdAt?: string;
  updatedAt?: string;
  description?: string;
}

const chartOptions = [
  { value: "number", label: "Number Display" },
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "doughnut", label: "Doughnut Chart" },
  { value: "radar", label: "Radar Chart" },
  { value: "polarArea", label: "Polar Area" },
  { value: "area", label: "Area Chart" },
];

const dataEndpoints = [
  { value: "/api/data/total_revenue", label: "Total Revenue" },
  { value: "/api/data/orders_over_time", label: "Orders Over Time" },
  { value: "/api/data/signups_by_region", label: "Signups by Region" },
  { value: "/api/data/user_growth_by_month", label: "User Growth by Month" },
  { value: "/api/data/conversion_rate_over_time", label: "Conversion Rate Over Time" },
  { value: "/api/data/page_views_by_category", label: "Page Views by Category" },
];

const chartColors = [
  { value: "#60a5fa", label: "Blue" },
  { value: "#34d399", label: "Green" },
  { value: "#fbbf24", label: "Yellow" },
  { value: "#f87171", label: "Red" },
  { value: "#a78bfa", label: "Purple" },
];

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const dashboardId = params.id as string;
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    type: "number",
    title: "",
    dataEndpoint: dataEndpoints[0].value,
    color: chartColors[0].value,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [typeOptions, setTypeOptions] = useState(["number", "bar", "line", "pie", "doughnut", "radar", "polarArea", "area"]);
  const [reordering, setReordering] = useState(false);
  const [editChart, setEditChart] = useState<Chart | null>(null);
  const [editForm, setEditForm] = useState({ type: "number", title: "", dataEndpoint: dataEndpoints[0].value, color: chartColors[0].value });
  const [editLoading, setEditLoading] = useState(false);
  const [editPreviewData, setEditPreviewData] = useState<any>(null);
  const [editPreviewLoading, setEditPreviewLoading] = useState(false);
  const [editTypeOptions, setEditTypeOptions] = useState(["number", "bar", "line", "pie", "doughnut", "radar", "polarArea", "area"]);
  const [deleteChartId, setDeleteChartId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fullscreenChart, setFullscreenChart] = useState<Chart | null>(null);
  const dashboardRef = React.useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboards, setDashboards] = useState<any[]>([]);

  // --- Editable title/description state ---
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [dashboardEditLoading, setDashboardEditLoading] = useState(false);

  // --- ResponsiveGridLayout layouts state ---
  const [layouts, setLayouts] = useState<any>({});
  const [layoutsBase, setLayoutsBase] = useState<any>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch dashboard from API
        const dashRes = await fetch(`/api/dashboards/${dashboardId}`);
        if (!dashRes.ok) {
          router.push("/");
          return;
        }
        const dash = await dashRes.json();
        setDashboard(dash);
        
        // Fetch charts for this dashboard
        const chartsRes = await fetch(`/api/charts?dashboardId=${dashboardId}`);
        if (chartsRes.ok) {
          const chartsData = await chartsRes.json();
          setCharts(chartsData);
        }
        
        // Fetch all dashboards for sidebar
        const allDashboardsRes = await fetch('/api/dashboards');
        if (allDashboardsRes.ok) {
          const allDashboards = await allDashboardsRes.json();
          setDashboards(allDashboards);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        router.push("/");
        return;
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dashboardId, router]);

  useEffect(() => {
    if (dashboard) {
      setEditTitle(dashboard.name);
      setEditDescription(dashboard.description || "");
    }
  }, [dashboard]);

  // Set up layouts for all breakpoints
  useEffect(() => {
    if (charts && charts.length > 0) {
      setLayouts({
        lg: charts.map(chart => ({
          i: chart.id,
          x: chart.x || 0,
          y: chart.y || 0,
          w: chart.w || 6,
          h: chart.h || 6,
          minW: 3,
          minH: 4,
        })),
        md: charts.map(chart => ({
          i: chart.id,
          x: chart.x || 0,
          y: chart.y || 0,
          w: Math.max(3, Math.floor((chart.w || 6) / 2)),
          h: chart.h || 6,
          minW: 2,
          minH: 4,
        })),
        sm: charts.map(chart => ({
          i: chart.id,
          x: 0,
          y: chart.y || 0,
          w: 6,
          h: chart.h || 6,
          minW: 2,
          minH: 4,
        })),
        xs: charts.map(chart => ({
          i: chart.id,
          x: 0,
          y: chart.y || 0,
          w: 4,
          h: chart.h || 6,
          minW: 2,
          minH: 4,
        })),
        xxs: charts.map(chart => ({
          i: chart.id,
          x: 0,
          y: chart.y || 0,
          w: 2,
          h: chart.h || 6,
          minW: 2,
          minH: 4,
        })),
      });
      setLayoutsBase({
        lg: charts.map(chart => ({
          i: chart.id,
          x: chart.x || 0,
          y: chart.y || 0,
          w: chart.w || 6,
          h: chart.h || 6,
          minW: 3,
          minH: 4,
        })),
        md: charts.map(chart => ({
          i: chart.id,
          x: chart.x || 0,
          y: chart.y || 0,
          w: Math.max(3, Math.floor((chart.w || 6) / 2)),
          h: chart.h || 6,
          minW: 2,
          minH: 4,
        })),
        sm: charts.map(chart => ({
          i: chart.id,
          x: 0,
          y: chart.y || 0,
          w: 6,
          h: chart.h || 6,
          minW: 2,
          minH: 4,
        })),
        xs: charts.map(chart => ({
          i: chart.id,
          x: 0,
          y: chart.y || 0,
          w: 4,
          h: chart.h || 6,
          minW: 2,
          minH: 4,
        })),
        xxs: charts.map(chart => ({
          i: chart.id,
          x: 0,
          y: chart.y || 0,
          w: 2,
          h: chart.h || 6,
          minW: 2,
          minH: 4,
        })),
      });
    }
  }, [charts]);

  // Calculate scale factor for grid zoom-out effect
  useEffect(() => {
    function handleResize() {
      const baseWidth = 2000; // match the GridLayout width
      if (gridContainerRef.current) {
        const containerWidth = gridContainerRef.current.offsetWidth;
        const newScale = Math.min(1, containerWidth / baseWidth);
        setScale(newScale);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to get charts in dashboard order
  const orderedCharts = charts;

  // --- Add Chart Modal Logic ---
  useEffect(() => {
    // Reset preview and type options when endpoint changes
    setPreviewData(null);
    setTypeOptions(["number", "bar", "line", "pie", "doughnut", "scatter", "radar", "polarArea"]);
    if (!addForm.dataEndpoint) return;
    setPreviewLoading(true);
    fetch(addForm.dataEndpoint)
      .then(res => res.json())
      .then(data => {
        setPreviewData(data);
        // Chart type filtering logic
        if (typeof data.value === "number") {
          setTypeOptions(["number"]);
          setAddForm(f => ({ ...f, type: "number" }));
        } else if (Array.isArray(data.labels) && Array.isArray(data.values)) {
          setTypeOptions(["bar", "line", "pie", "doughnut", "radar", "polarArea", "area"]);
          setAddForm(f => ({ ...f, type: "bar" }));
        } else {
          setTypeOptions(["number", "bar", "line", "pie", "doughnut", "radar", "polarArea", "area"]);
        }
      })
      .catch(() => {
        setPreviewData(null);
        setTypeOptions(["number", "bar", "line", "pie", "doughnut", "radar", "polarArea", "area"]);
      })
      .finally(() => setPreviewLoading(false));
    // eslint-disable-next-line
  }, [addForm.dataEndpoint]);

  // --- Edit Chart Modal Logic ---
  useEffect(() => {
    if (!editChart) return;
    
    // Pre-fill the edit form with existing chart data
    setEditForm({
      type: editChart.type,
      title: editChart.title,
      dataEndpoint: editChart.dataEndpoint,
      color: editChart.color || chartColors[0].value,
    });
    
    // Reset preview and type options
    setEditPreviewData(null);
    setEditTypeOptions(["number", "bar", "line", "pie", "doughnut", "scatter", "radar", "polarArea"]);
    
    // Load preview data for the current endpoint
    setEditPreviewLoading(true);
    fetch(editChart.dataEndpoint)
      .then(res => res.json())
      .then(data => {
        setEditPreviewData(data);
        // Chart type filtering logic
        if (typeof data.value === "number") {
          setEditTypeOptions(["number"]);
          setEditForm(f => ({ ...f, type: "number" }));
        } else if (Array.isArray(data.labels) && Array.isArray(data.values)) {
          setEditTypeOptions(["bar", "line", "pie", "doughnut", "radar", "polarArea", "area"]);
          setEditForm(f => ({ ...f, type: "bar" }));
        } else {
          setEditTypeOptions(["number", "bar", "line", "pie", "doughnut", "radar", "polarArea", "area"]);
        }
      })
      .catch(() => {
        setEditPreviewData(null);
        setEditTypeOptions(["number", "bar", "line", "pie", "doughnut", "radar", "polarArea", "area"]);
      })
      .finally(() => setEditPreviewLoading(false));
    // eslint-disable-next-line
  }, [editChart]);

  const handleAddChart = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const response = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardId,
          type: addForm.type,
          title: addForm.title,
          dataEndpoint: addForm.dataEndpoint,
          color: addForm.color,
        }),
      });
      if (response.ok) {
        const newChart = await response.json();
        setCharts(prev => [...prev, newChart]);
        setAddModalOpen(false);
        setAddForm({ type: "number", title: "", dataEndpoint: dataEndpoints[0].value, color: chartColors[0].value });
        setPreviewData(null);
      }
    } catch (error) {
      console.error('Failed to add chart:', error);
    } finally {
      setAddLoading(false);
    }
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewLoading(true);
    try {
      const response = await fetch(addForm.dataEndpoint);
      const data = await response.json();
      setPreviewData(data);
    } catch (error) {
      console.error('Failed to preview chart:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleEditPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditPreviewLoading(true);
    try {
      const response = await fetch(editForm.dataEndpoint);
      const data = await response.json();
      setEditPreviewData(data);
    } catch (error) {
      console.error('Failed to preview chart:', error);
    } finally {
      setEditPreviewLoading(false);
    }
  };

  const onLayoutChange = async (layout: any) => {
    if (reordering) return;
    setReordering(true);
    try {
      // Update chart positions in the database
      const updatedCharts = charts.map((chart, index) => {
        const layoutItem = layout.find((item: any) => item.i === chart.id);
        if (layoutItem) {
          return {
            ...chart,
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };
        }
        return chart;
      });

      // Update each chart via API
      for (const chart of updatedCharts) {
        await fetch(`/api/charts/${chart.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chart),
        });
      }

      setCharts(updatedCharts);
    } catch (error) {
      console.error('Failed to update layout:', error);
    } finally {
      setReordering(false);
    }
  };

  const handleEditChart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editChart) return;
    setEditLoading(true);
    try {
      const response = await fetch(`/api/charts/${editChart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: editForm.type,
          title: editForm.title,
          dataEndpoint: editForm.dataEndpoint,
          color: editForm.color,
        }),
      });
      if (response.ok) {
        const updatedChart = await response.json();
        setCharts(prev => prev.map(chart => chart.id === editChart.id ? updatedChart : chart));
        setEditChart(null);
        setEditForm({ type: "number", title: "", dataEndpoint: dataEndpoints[0].value, color: chartColors[0].value });
        setEditPreviewData(null);
      }
    } catch (error) {
      console.error('Failed to update chart:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteChart = async (id: string) => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/charts/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCharts(prev => prev.filter(chart => chart.id !== id));
        setDeleteChartId(null);
      }
    } catch (error) {
      console.error('Failed to delete chart:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    
    console.log('Starting PDF export...');
    
    // Add export class to body
    document.body.classList.add('exporting-pdf');
    console.log('Added exporting-pdf class to body');
    
    // Hide elements that shouldn't be in the export
    const elementsToHide = document.querySelectorAll('.no-export');
    const originalDisplays: string[] = [];
    elementsToHide.forEach((el, index) => {
      originalDisplays[index] = (el as HTMLElement).style.display;
      (el as HTMLElement).style.display = 'none';
      console.log('Hidden element:', el);
    });
    
    try {
      console.log('Capturing canvas...');
      const canvas = await html2canvas(dashboardRef.current, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: dashboardRef.current.scrollWidth,
        height: dashboardRef.current.scrollHeight
      });
      console.log('Canvas captured, generating PDF...');
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${dashboard?.name || 'dashboard'}.pdf`);
      console.log('PDF export completed');
    } finally {
      // Remove export class
      document.body.classList.remove('exporting-pdf');
      console.log('Removed exporting-pdf class from body');
      
      // Restore hidden elements
      elementsToHide.forEach((el, index) => {
        (el as HTMLElement).style.display = originalDisplays[index];
        console.log('Restored element:', el);
      });
    }
  };

  // Save dashboard title/description and layout
  const handleSaveDashboard = async () => {
    if (!dashboard) return;
    setDashboardEditLoading(true);
    try {
      // Save the current layout for the current breakpoint as the base layout
      setLayoutsBase((prev: any) => ({ ...prev, [currentBreakpoint]: layouts[currentBreakpoint] }));
      const response = await fetch(`/api/dashboards/${dashboard.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editTitle, description: editDescription }),
      });
      if (response.ok) {
        const updated = await response.json();
        setDashboard(updated);
      }
    } finally {
      setDashboardEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint dark:border-pink mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dashboard not found</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-mint dark:bg-pink text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mint dark:focus:ring-pink"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{dashboard.name}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAddModalOpen(true)}
                className="bg-mint dark:bg-pink text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Add Chart
              </button>
              <button
                onClick={handleExportPDF}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Export PDF
              </button>
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to Home
              </button>
              <div className="ml-4">
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          currentDashboardId={dashboardId}
        />

        {/* Main Content */}
        <div className="flex-1">
          <div className="px-6 py-8">
            <div ref={dashboardRef} id="dashboard-export" className="pb-8">
              {loading ? (
                <div>Loading...</div>
              ) : dashboard ? (
                <>
                  <div className="p-4 flex items-center gap-4">
                    <button
                      className="btn btn-primary px-6 py-2 rounded-xl shadow hover:shadow-lg flex items-center gap-2"
                      onClick={handleSaveDashboard}
                      disabled={dashboardEditLoading}
                    >
                      {dashboardEditLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                  <div className="p-4">
                      <input
                        className="text-5xl font-bold mb-2 tracking-tight bg-transparent border-none outline-none w-full"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        disabled={dashboardEditLoading}
                        style={{ fontSize: '2.5rem' }}
                      />
                      <textarea
                        className="text-lg text-gray-600 dark:text-gray-300 mb-1 bg-transparent border-none outline-none w-full resize-none"
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        placeholder="Add a description..."
                        rows={2}
                        disabled={dashboardEditLoading}
                        style={{ minHeight: 32 }}
                      />
                      {dashboard.createdAt && (
                        <div className="text-sm text-gray-400 dark:text-gray-500">
                          Created on {new Date(dashboard.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      )}
                  </div>
                  {/* Add Chart Button */}
                  <div className="p-4 flex justify-end">
                    <button
                      className="btn btn-primary px-6 py-2 rounded-xl shadow hover:shadow-lg flex items-center gap-2"
                      onClick={() => setAddModalOpen(true)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Chart
                    </button>
                  </div>

                  {/* Add Chart Modal */}
                  {addModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <form
                        onSubmit={handleAddChart}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4"
                      >
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add Chart</h2>
                          <p className="text-gray-600 dark:text-gray-300">Configure your chart below. Chart type options will update based on the endpoint shape.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-xs mb-1">Title</label>
                            <input
                              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-400 focus:border-blue-300 dark:focus:border-blue-400"
                              value={addForm.title}
                              onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs mb-1">Endpoint</label>
                            <select
                              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={addForm.dataEndpoint}
                              onChange={e => setAddForm(f => ({ ...f, dataEndpoint: e.target.value }))}
                            >
                              {dataEndpoints.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs mb-1">Color Palette</label>
                            <select
                              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={addForm.color}
                              onChange={e => setAddForm(f => ({ ...f, color: e.target.value }))}
                            >
                              {chartColors.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs mb-1">Chart Type</label>
                            <select
                              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={addForm.type}
                              onChange={e => setAddForm(f => ({ ...f, type: e.target.value }))}
                            >
                              {chartOptions.filter(opt => typeOptions.includes(opt.value)).map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={handlePreview}
                            className="btn btn-outline"
                            disabled={previewLoading}
                          >
                            {previewLoading ? "Loading..." : "Preview Chart"}
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={addLoading || !addForm.title.trim()}
                          >
                            {addLoading ? "Saving..." : "Add Chart"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline ml-auto"
                            onClick={() => {
                              setAddModalOpen(false);
                              setAddForm({ type: "number", title: "", dataEndpoint: dataEndpoints[0].value, color: chartColors[0].value });
                              setPreviewData(null);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                        {/* Chart Preview */}
                        {previewData && (
                          <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="mb-2 text-sm text-gray-500 font-medium">Chart Preview</div>
                            <ChartRenderer
                              type={addForm.type as "number" | "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea" | "area"}
                              title={addForm.title || "Preview"}
                              data={previewData}
                              color={addForm.color}
                            />
                          </div>
                        )}
                      </form>
                    </div>
                  )}

                  {/* Dashboard Grid */}
                  <div ref={gridContainerRef} style={{ width: '100%', overflow: 'auto' }}>
                    <div style={{ width: '2000px', transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                      <GridLayout
                        className="layout"
                        layout={layouts.lg || []}
                        cols={12}
                        rowHeight={80}
                        width={2000}
                        onLayoutChange={onLayoutChange}
                        isDraggable={true}
                        isResizable={true}
                        margin={[16, 16]}
                        containerPadding={[16, 16]}
                      >
                        {orderedCharts.map(chart => (
                          <div key={chart.id} className="dashboard-container bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4" style={{ minHeight: '320px', height: '100%' }}>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{chart.title}</h3>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setEditChart(chart)}
                                  className="text-gray-400 hover:text-mint dark:hover:text-pink p-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setDeleteChartId(chart.id)}
                                  className="text-gray-400 hover:text-red-500 p-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="flex-1" style={{ height: 'calc(100% - 60px)' }}>
                              <ChartContainer chart={chart} setFullscreenChart={setFullscreenChart} />
                            </div>
                          </div>
                        ))}
                      </GridLayout>
                    </div>
                  </div>

                  {/* Edit Chart Modal */}
                  {editChart && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <form
                        onSubmit={handleEditChart}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4"
                      >
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Edit Chart</h2>
                          <p className="text-gray-600 dark:text-gray-300">Update your chart configuration below.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-xs mb-1">Title</label>
                            <input
                              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-400 focus:border-blue-300 dark:focus:border-blue-400"
                              value={editForm.title}
                              onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs mb-1">Endpoint</label>
                            <select
                              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={editForm.dataEndpoint}
                              onChange={e => setEditForm(f => ({ ...f, dataEndpoint: e.target.value }))}
                            >
                              {dataEndpoints.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs mb-1">Color Palette</label>
                            <select
                              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={editForm.color}
                              onChange={e => setEditForm(f => ({ ...f, color: e.target.value }))}
                            >
                              {chartColors.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs mb-1">Chart Type</label>
                            <select
                              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={editForm.type}
                              onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
                            >
                              {chartOptions.filter(opt => editTypeOptions.includes(opt.value)).map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={handleEditPreview}
                            className="btn btn-outline"
                            disabled={editPreviewLoading}
                          >
                            {editPreviewLoading ? "Loading..." : "Preview Chart"}
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={editLoading || !editForm.title.trim()}
                          >
                            {editLoading ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline ml-auto"
                            onClick={() => {
                              setEditChart(null);
                              setEditForm({ type: "number", title: "", dataEndpoint: dataEndpoints[0].value, color: chartColors[0].value });
                              setEditPreviewData(null);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                        {/* Chart Preview */}
                        {editPreviewData && (
                          <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="mb-2 text-sm text-gray-500 font-medium">Chart Preview</div>
                            <ChartRenderer
                              type={editForm.type as "number" | "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea" | "area"}
                              title={editForm.title || "Preview"}
                              data={editPreviewData}
                              color={editForm.color}
                            />
                          </div>
                        )}
                      </form>
                    </div>
                  )}

                  {/* Delete Confirmation Modal */}
                  {deleteChartId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Delete Chart</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this chart? This action cannot be undone.</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDeleteChart(deleteChartId)}
                            className="btn btn-danger"
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? "Deleting..." : "Delete"}
                          </button>
                          <button
                            onClick={() => setDeleteChartId(null)}
                            className="btn btn-outline ml-auto"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>Dashboard not found.</div>
              )}
              {/* Fullscreen Chart Modal */}
              {fullscreenChart && (
                <FullscreenChartModal chart={fullscreenChart} onClose={() => setFullscreenChart(null)} />
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

function ChartContainer({ chart, setFullscreenChart }: { chart: Chart, setFullscreenChart: (c: Chart) => void }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch(chart.dataEndpoint)
      .then((res) => res.json())
      .then(setData);
  }, [chart.dataEndpoint]);
  
  const handleClick = () => {
    setFullscreenChart(chart);
  };
  
  if (!data) return <div className="bg-white dark:bg-gray-800 shadow rounded p-6 h-full flex items-center justify-center">Loading chart...</div>;
  return (
    <div onClick={handleClick} className="cursor-pointer group h-full flex flex-col" style={{ pointerEvents: 'auto' }}>
      <div className="flex-1 min-h-0">
        <ChartRenderer type={chart.type} title={chart.title} data={data} color={chart.color} />
      </div>
      <div className="text-xs text-gray-400 text-center mt-2 group-hover:text-mint dark:group-hover:text-pink flex-shrink-0">Click to enlarge</div>
    </div>
  );
}

function FullscreenChartModal({ chart, onClose }: { chart: Chart, onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch(chart.dataEndpoint)
      .then((res) => res.json())
      .then(setData);
  }, [chart.dataEndpoint]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-6xl w-full max-h-[80vh] relative flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{chart.title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-mint dark:hover:text-pink text-2xl font-bold p-2"
          >
            ×
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          {data ? (
            <div className="w-full" style={{ height: 'calc(80vh - 120px)', minHeight: '250px' }}>
              <ChartRenderer type={chart.type} title={chart.title} data={data} color={chart.color} fullscreen />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading chart...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 