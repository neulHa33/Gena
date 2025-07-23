"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import ThemeToggleClientWrapper from './ThemeToggleClientWrapper';
import Sidebar from './Sidebar';
import HamburgerMenu from './HamburgerMenu';

export default function NavigationBar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Extract dashboard ID from pathname for sidebar highlighting
  const dashboardId = pathname.startsWith('/dashboard/') ? pathname.split('/')[2] : undefined;

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isHomePage && (
            <HamburgerMenu onClick={() => setSidebarOpen(true)} />
          )}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
        <ThemeToggleClientWrapper />
      </nav>
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentDashboardId={dashboardId}
      />
    </>
  );
} 