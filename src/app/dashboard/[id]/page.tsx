"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChartRenderer from "../../../components/ChartRenderer";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Chart {
  id: string;
  dashboardId: string;
  type: "number" | "bar" | "line";
  title: string;
  dataEndpoint: string;
  color?: string;
}

interface Dashboard {
  id: string;
  name: string;
  chartIds: string[];
}

const chartOptions = [
  { value: "number", label: "Number (e.g. total revenue)" },
  { value: "bar", label: "Bar Chart (e.g. users by region)" },
  { value: "line", label: "Line Chart (e.g. orders over time)" },
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
  const [typeOptions, setTypeOptions] = useState(["number", "bar", "line"]);
  const [reordering, setReordering] = useState(false);
  const [editChart, setEditChart] = useState<Chart | null>(null);
  const [editForm, setEditForm] = useState({ type: "number", title: "", dataEndpoint: dataEndpoints[0].value, color: chartColors[0].value });
  const [editLoading, setEditLoading] = useState(false);
  const [editPreviewData, setEditPreviewData] = useState<any>(null);
  const [editPreviewLoading, setEditPreviewLoading] = useState(false);
  const [editTypeOptions, setEditTypeOptions] = useState(["number", "bar", "line"]);
  const [deleteChartId, setDeleteChartId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fullscreenChart, setFullscreenChart] = useState<Chart | null>(null);
  const dashboardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const dashRes = await fetch(`/api/dashboards/${dashboardId}`);
      if (!dashRes.ok) {
        router.push("/");
        return;
      }
      const dash = await dashRes.json();
      setDashboard(dash);
      const chartsRes = await fetch(`/api/charts`);
      const allCharts = await chartsRes.json();
      setCharts(allCharts.filter((c: Chart) => c.dashboardId === dashboardId));
      setLoading(false);
    }
    fetchData();
  }, [dashboardId, router]);

  // Helper to get charts in dashboard order
  const orderedCharts = dashboard && dashboard.chartIds.length > 0
    ? dashboard.chartIds.map((id) => charts.find((c) => c.id === id)).filter(Boolean) as Chart[]
    : charts;

  // --- Add Chart Modal Logic ---
  useEffect(() => {
    // Reset preview and type options when endpoint changes
    setPreviewData(null);
    setTypeOptions(["number", "bar", "line"]);
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
          setTypeOptions(["bar", "line"]);
          setAddForm(f => ({ ...f, type: "bar" }));
        } else {
          setTypeOptions(["number", "bar", "line"]);
        }
      })
      .catch(() => {
        setPreviewData(null);
        setTypeOptions(["number", "bar", "line"]);
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
    setEditTypeOptions(["number", "bar", "line"]);
    
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
          setEditTypeOptions(["bar", "line"]);
          setEditForm(f => ({ ...f, type: "bar" }));
        } else {
          setEditTypeOptions(["number", "bar", "line"]);
        }
      })
      .catch(() => {
        setEditPreviewData(null);
        setEditTypeOptions(["number", "bar", "line"]);
      })
      .finally(() => setEditPreviewLoading(false));
  }, [editChart]);

  // Update edit preview when endpoint changes
  useEffect(() => {
    if (!editForm.dataEndpoint) return;
    setEditPreviewData(null);
    setEditTypeOptions(["number", "bar", "line"]);
    setEditPreviewLoading(true);
    fetch(editForm.dataEndpoint)
      .then(res => res.json())
      .then(data => {
        setEditPreviewData(data);
        // Chart type filtering logic
        if (typeof data.value === "number") {
          setEditTypeOptions(["number"]);
          setEditForm(f => ({ ...f, type: "number" }));
        } else if (Array.isArray(data.labels) && Array.isArray(data.values)) {
          setEditTypeOptions(["bar", "line"]);
          setEditForm(f => ({ ...f, type: "bar" }));
        } else {
          setEditTypeOptions(["number", "bar", "line"]);
        }
      })
      .catch(() => {
        setEditPreviewData(null);
        setEditTypeOptions(["number", "bar", "line"]);
      })
      .finally(() => setEditPreviewLoading(false));
  }, [editForm.dataEndpoint]);

  const handleAddChart = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    const res = await fetch("/api/charts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dashboardId,
        ...addForm,
      }),
    });
    const newChart = await res.json();
    setCharts((prev) => [...prev, newChart]);
    // Update dashboard chartIds order
    if (dashboard) {
      const updatedChartIds = [...dashboard.chartIds, newChart.id];
      setDashboard({ ...dashboard, chartIds: updatedChartIds });
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartIds: updatedChartIds }),
      });
    }
    setAddForm({ type: "number", title: "", dataEndpoint: dataEndpoints[0].value, color: chartColors[0].value });
    setAddModalOpen(false);
    setAddLoading(false);
    setPreviewData(null);
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewLoading(true);
    setPreviewData(null);
    try {
      const res = await fetch(addForm.dataEndpoint);
      const data = await res.json();
      setPreviewData(data);
    } catch {
      setPreviewData(null);
    }
    setPreviewLoading(false);
  };

  const handleEditPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditPreviewLoading(true);
    setEditPreviewData(null);
    try {
      const res = await fetch(editForm.dataEndpoint);
      const data = await res.json();
      setEditPreviewData(data);
    } catch {
      setEditPreviewData(null);
    }
    setEditPreviewLoading(false);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !dashboard) return;
    if (result.source.index === result.destination.index) return;
    setReordering(true);
    const newChartIds = Array.from(dashboard.chartIds);
    const [removed] = newChartIds.splice(result.source.index, 1);
    newChartIds.splice(result.destination.index, 0, removed);
    setDashboard({ ...dashboard, chartIds: newChartIds });
    await fetch(`/api/dashboards/${dashboardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chartIds: newChartIds }),
    });
    setReordering(false);
  };

  // --- Edit Chart Logic ---
  const handleEditChart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editChart) return;
    setEditLoading(true);
    await fetch(`/api/charts/${editChart.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setCharts((prev) => prev.map((c) =>
      c.id === editChart.id
        ? { ...c, ...editForm, type: editForm.type as "number" | "bar" | "line" }
        : c
    ));
    setEditChart(null);
    setEditLoading(false);
    setEditPreviewData(null);
  };

  const handleDeleteChart = async (id: string) => {
    setDeleteLoading(true);
    await fetch(`/api/charts/${id}`, { method: "DELETE" });
    setCharts((prev) => prev.filter((c) => c.id !== id));
    if (dashboard) {
      const updatedChartIds = dashboard.chartIds.filter((cid) => cid !== id);
      setDashboard({ ...dashboard, chartIds: updatedChartIds });
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartIds: updatedChartIds }),
      });
    }
    setDeleteChartId(null);
    setDeleteLoading(false);
  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    
    console.log('Starting PDF export...');
    
    // Add export class to body to hide floating elements
    document.body.classList.add('exporting-pdf');
    console.log('Added exporting-pdf class to body');
    
    // Manually hide specific elements that might still be visible
    const elementsToHide = document.querySelectorAll('.fixed, .absolute, nav, button[onclick*="setAddModalOpen"], .btn-outline');
    const originalDisplays: string[] = [];
    
    elementsToHide.forEach((el) => {
      originalDisplays.push((el as HTMLElement).style.display);
      (el as HTMLElement).style.display = 'none';
      console.log('Hidden element:', el);
    });
    
    try {
      console.log('Starting html2canvas capture...');
      const canvas = await html2canvas(dashboardRef.current, { 
        backgroundColor: '#ffffff', 
        scale: 2,
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

  return (
    <main className="w-full">
      <div className="mb-6 flex items-center gap-2 justify-between flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <button
            className="text-blue-500 hover:underline text-sm"
            onClick={() => router.push("/")}
          >
            ← Dashboards
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-700 text-sm truncate">{dashboard?.name}</span>
        </div>
        <button
          className="btn btn-outline px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={handleExportPDF}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Export to PDF
        </button>
      </div>
      <div ref={dashboardRef} id="dashboard-export" className="pb-8">
        {loading ? (
          <div>Loading...</div>
        ) : dashboard ? (
          <>
            <h1 className="text-2xl font-bold mb-4 tracking-tight">{dashboard.name}</h1>
            {/* Add Chart Button */}
            <div className="mb-8 flex justify-end">
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
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Chart</h2>
                    <p className="text-gray-600">Configure your chart below. Chart type options will update based on the endpoint shape.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs mb-1">Title</label>
                      <input
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                        value={addForm.title}
                        onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Endpoint</label>
                      <select
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white"
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
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white"
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
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white"
                        value={addForm.type}
                        onChange={e => setAddForm(f => ({ ...f, type: e.target.value }))}
                      >
                        {chartOptions.filter(opt => typeOptions.includes(opt.value)).map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mb-6">
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
                      {addLoading ? "Adding..." : "Add Chart"}
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
                        type={addForm.type as "number" | "bar" | "line"}
                        title={addForm.title || "Preview"}
                        data={previewData}
                        color={addForm.color}
                      />
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Chart List (Draggable) */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="charts-droppable">
                {(provided) => (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {orderedCharts.length === 0 && (
                      <div className="text-gray-400">No charts yet. Add one above!</div>
                    )}
                    {orderedCharts.map((chart, idx) => (
                      <Draggable key={chart.id} draggableId={chart.id} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`card transition-shadow ${snapshot.isDragging ? "shadow-2xl" : ""}`}
                          >
                            <div className="relative group">
                              <ChartContainer chart={chart} setFullscreenChart={setFullscreenChart} />
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button
                                  className="bg-white border border-gray-200 rounded p-1 shadow hover:bg-blue-50"
                                  title="Edit"
                                  onClick={() => setEditChart(chart)}
                                >
                                  <span className="sr-only">Edit</span>
                                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z"/></svg>
                                </button>
                                <button
                                  className="bg-white border border-gray-200 rounded p-1 shadow hover:bg-red-50"
                                  title="Delete"
                                  onClick={() => setDeleteChartId(chart.id)}
                                >
                                  <span className="sr-only">Delete</span>
                                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                                </button>
                              </div>
                            </div>
                            {deleteChartId === chart.id && (
                              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full">
                                  <div className="mb-4 text-center">
                                    <div className="font-semibold mb-2">Delete chart?</div>
                                    <div className="text-gray-500 text-sm">This action cannot be undone.</div>
                                  </div>
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                                      onClick={() => handleDeleteChart(chart.id)}
                                      disabled={deleteLoading}
                                    >
                                      {deleteLoading ? "Deleting..." : "Delete"}
                                    </button>
                                    <button
                                      className="bg-gray-100 px-4 py-2 rounded shadow hover:bg-gray-200"
                                      onClick={() => setDeleteChartId(null)}
                                      disabled={deleteLoading}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {reordering && <div className="text-xs text-gray-400 mt-2">Saving order...</div>}
            {/* Chart Edit Modal */}
            {editChart && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <form
                  onSubmit={handleEditChart}
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Chart</h2>
                    <p className="text-gray-600">Update your chart configuration below. Chart type options will update based on the endpoint shape.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs mb-1">Title</label>
                      <input
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                        value={editForm.title}
                        onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Endpoint</label>
                      <select
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white"
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
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white"
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
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white"
                        value={editForm.type}
                        onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
                      >
                        {chartOptions.filter(opt => editTypeOptions.includes(opt.value)).map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mb-6">
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
                        type={editForm.type as "number" | "bar" | "line"}
                        title={editForm.title || "Preview"}
                        data={editPreviewData}
                        color={editForm.color}
                      />
                    </div>
                  )}
                </form>
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
    </main>
  );
}

function ChartContainer({ chart, setFullscreenChart }: { chart: Chart, setFullscreenChart: (c: Chart) => void }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch(chart.dataEndpoint)
      .then((res) => res.json())
      .then(setData);
  }, [chart.dataEndpoint]);
  if (!data) return <div className="bg-white dark:bg-gray-800 shadow rounded p-6">Loading chart...</div>;
  return (
    <div onClick={() => setFullscreenChart(chart)} className="cursor-pointer group">
      <ChartRenderer type={chart.type} title={chart.title} data={data} color={chart.color} />
      <div className="text-xs text-gray-400 text-center mt-2 group-hover:text-mint dark:group-hover:text-pink">Click to enlarge</div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-2 sm:p-4 max-w-2xl w-full mx-2 sm:mx-4 relative flex flex-col items-center">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-mint dark:hover:text-pink text-2xl font-bold">×</button>
        <div className="w-full h-[60vw] max-h-[70vh] min-h-[300px] flex items-center justify-center">
          {data ? (
            <ChartRenderer type={chart.type} title={chart.title} data={data} color={chart.color} fullscreen />
          ) : (
            <div className="text-gray-400">Loading chart...</div>
          )}
        </div>
      </div>
    </div>
  );
} 