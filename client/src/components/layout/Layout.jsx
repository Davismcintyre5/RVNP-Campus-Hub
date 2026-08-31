import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import MobileNav from './MobileNav.jsx';
import RightPanel from './RightPanel.jsx';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0 w-full px-3 sm:px-4 py-4 pb-24 lg:pb-4">
          {children}
        </main>

        <RightPanel />
      </div>

      <MobileNav />
    </div>
  );
};

export default Layout;