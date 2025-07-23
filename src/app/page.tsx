"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Dashboard {
  id: string;
  name: string;
  chartIds: string[];
}

export default function HomePage() {
  const router = useRouter();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "" });
  const [createLoading, setCreateLoading] = useState(false);
  const [editDashboard, setEditDashboard] = useState<Dashboard | null>(null);
  const [editForm, setEditForm] = useState({ name: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteDashboard, setDeleteDashboard] = useState<Dashboard | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchDashboards() {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboards");
        const data = await res.json();
        setDashboards(data);
      } catch (error) {
        console.error("Failed to fetch dashboards:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboards();
  }, []);

  const filteredDashboards = dashboards.filter((dashboard) =>
    dashboard.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDashboards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDashboards = filteredDashboards.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch("/api/dashboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const newDashboard = await res.json();
      setDashboards((prev) => [...prev, newDashboard]);
      setCreateForm({ name: "" });
      setCreateModalOpen(false);
      router.push(`/dashboard/${newDashboard.id}`);
    } catch (error) {
      console.error("Failed to create dashboard:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDashboard) return;
    setEditLoading(true);
    try {
      await fetch(`/api/dashboards/${editDashboard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setDashboards((prev) =>
        prev.map((d) =>
          d.id === editDashboard.id ? { ...d, name: editForm.name } : d
        )
      );
      setEditDashboard(null);
      setEditForm({ name: "" });
    } catch (error) {
      console.error("Failed to edit dashboard:", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteDashboard = async () => {
    if (!deleteDashboard) return;
    setDeleteLoading(true);
    try {
      await fetch(`/api/dashboards/${deleteDashboard.id}`, {
        method: "DELETE",
      });
      setDashboards((prev) => prev.filter((d) => d.id !== deleteDashboard.id));
      setDeleteDashboard(null);
    } catch (error) {
      console.error("Failed to delete dashboard:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <main className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Your Dashboards</h1>
        <p className="text-gray-600 dark:text-gray-400">Create and manage your data dashboards</p>
      </div>

      {/* Search and Create */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search dashboards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-mint dark:focus:ring-pink focus:border-transparent"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn btn-primary px-6 py-2 rounded-xl shadow hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Dashboard
        </button>
      </div>

      {/* Dashboard List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400">Loading dashboards...</div>
        </div>
      ) : filteredDashboards.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {searchTerm ? "No dashboards found matching your search." : "No dashboards yet."}
          </div>
          {!searchTerm && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="btn btn-primary"
            >
              Create your first dashboard
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedDashboards.map((dashboard) => (
              <div key={dashboard.id} className="card group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
                    {dashboard.name}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => {
                        setEditDashboard(dashboard);
                        setEditForm({ name: dashboard.name });
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteDashboard(dashboard)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {dashboard.chartIds.length} chart{dashboard.chartIds.length !== 1 ? "s" : ""}
                </div>
                <button
                  onClick={() => router.push(`/dashboard/${dashboard.id}`)}
                  className="btn btn-outline w-full"
                >
                  Open Dashboard
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline px-3 py-1 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Dashboard Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleCreateDashboard} className="modal">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400">Give your dashboard a name to get started.</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dashboard Name
              </label>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-mint dark:focus:ring-pink focus:border-transparent"
                placeholder="Enter dashboard name..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createLoading || !createForm.name.trim()}
              >
                {createLoading ? "Creating..." : "Create Dashboard"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setCreateModalOpen(false);
                  setCreateForm({ name: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Dashboard Modal */}
      {editDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleEditDashboard} className="modal">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Edit Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400">Update your dashboard name.</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dashboard Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-ring-mint dark:focus:ring-pink focus:border-transparent"
                placeholder="Enter dashboard name..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={editLoading || !editForm.name.trim()}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditDashboard(null);
                  setEditForm({ name: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Dashboard Modal */}
      {deleteDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="modal">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Delete Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete "{deleteDashboard.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteDashboard}
                className="btn btn-danger"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Dashboard"}
              </button>
              <button
                onClick={() => setDeleteDashboard(null)}
                className="btn btn-outline"
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
