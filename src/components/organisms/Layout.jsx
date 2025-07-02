import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const titles = {
      '/': 'Dashboard',
      '/rooms': 'Room Management',
      '/reservations': 'Reservations',
      '/guests': 'Guest Directory',
      '/checkin': 'Guest Check-In',
      '/checkout': 'Guest Check-Out'
    };
    return titles[location.pathname] || 'Hotel Management';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:pl-64">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle()}
        />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;