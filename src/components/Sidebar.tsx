"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface Dashboard {
  id: string;
  name: string;
  chartIds: string[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentDashboardId?: string;
}

export default function Sidebar({ isOpen, onClose, currentDashboardId }: SidebarProps) {
  const router = useRouter();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDashboard, setEditingDashboard] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboards() {
      try {
        const res = await fetch('/api/dashboards');
        const data = await res.json();
        setDashboards(data);
      } catch (error) {
        console.error('Failed to fetch dashboards:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboards();
  }, []);

  const handleDashboardClick = useCallback((dashboardId: string) => {
    router.push(`/dashboard/${dashboardId}`);
    onClose();
  }, [router, onClose]);

  const handleRenameStart = useCallback((dashboard: Dashboard) => {
    setEditingDashboard(dashboard.id);
    setEditName(dashboard.name);
  }, []);

  const handleRenameSave = useCallback(async (dashboardId: string) => {
    try {
      const response = await fetch(`/api/dashboards/${dashboardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      
      if (response.ok) {
        setDashboards(prev => 
          prev.map(d => d.id === dashboardId ? { ...d, name: editName } : d)
        );
        setEditingDashboard(null);
        setEditName('');
      }
    } catch (error) {
      console.error('Failed to rename dashboard:', error);
    }
  }, [editName]);

  const handleRenameCancel = useCallback(() => {
    setEditingDashboard(null);
    setEditName('');
  }, []);

  const handleDeleteDashboard = useCallback(async (dashboardId: string) => {
    setDeleteLoading(dashboardId);
    try {
      const response = await fetch(`/api/dashboards/${dashboardId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setDashboards(prev => prev.filter(d => d.id !== dashboardId));
        // If we're on the deleted dashboard, redirect to home
        if (currentDashboardId === dashboardId) {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Failed to delete dashboard:', error);
    } finally {
      setDeleteLoading(null);
    }
  }, [currentDashboardId, router]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboards</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Dashboard List */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : dashboards.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No dashboards found
            </div>
          ) : (
            <div className="space-y-2">
              {dashboards.map((dashboard) => (
                <div key={dashboard.id} className="group">
                  {editingDashboard === dashboard.id ? (
                    // Edit mode
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRenameSave(dashboard.id);
                          } else if (e.key === 'Escape') {
                            handleRenameCancel();
                          }
                        }}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint dark:focus:ring-pink"
                        autoFocus
                      />
                      <button
                        onClick={() => handleRenameSave(dashboard.id)}
                        className="text-green-600 hover:text-green-700 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleRenameCancel}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <button
                        onClick={() => handleDashboardClick(dashboard.id)}
                        className={`flex-1 text-left ${
                          dashboard.id === currentDashboardId
                            ? 'text-gray-900 dark:text-white font-medium'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="truncate">{dashboard.name}</span>
                      </button>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRenameStart(dashboard)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                          title="Rename dashboard"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteDashboard(dashboard.id)}
                          disabled={deleteLoading === dashboard.id}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Delete dashboard"
                        >
                          {deleteLoading === dashboard.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              router.push('/');
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </button>
        </div>
      </div>
    </>
  );
} 