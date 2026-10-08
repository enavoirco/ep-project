import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Users,
  CalendarCheck,
  Building2,
  FileQuestion,
  History,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { BrandLogo } from '../common/BrandLogo.tsx';

interface AdminLayoutProps {
  currentPath: string;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPath, navigate, children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Billboard Locations', path: '/admin/locations', icon: MapPin },
    { label: 'CRM / Leads Pipeline', path: '/admin/leads', icon: Users },
    { label: 'Follow-ups', path: '/admin/follow-ups', icon: CalendarCheck },
    { label: 'Customers', path: '/admin/customers', icon: Building2 },
    { label: 'Enquiries Feed', path: '/admin/enquiries', icon: FileQuestion },
    { label: 'Activity Logs', path: '/admin/activity', icon: History },
    { label: 'Portal Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#302B2B] flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#302B2B] text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-[#454141]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-sm bg-[#454141] text-white hover:text-[#1098C7] cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-display font-bold text-white text-sm">
            BHAGYALAXMI <span className="text-[#1098C7]">CRM</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-xs text-zinc-300 hover:text-white flex items-center gap-1"
        >
          <span>Public Site</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Sidebar: Dark Charcoal (#302B2B) */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#302B2B] text-white flex flex-col justify-between transition-transform duration-200 border-r border-[#454141] shrink-0`}
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-[#454141]">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/')}
                className="text-left group cursor-pointer"
                title="View Public Site"
              >
                <BrandLogo variant="full" theme="dark" />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="font-medium text-[#1098C7]">Kalaburagi Media Portal</span>
              <span className="px-1.5 py-0.5 rounded-xs bg-[#454141] text-zinc-200 uppercase font-mono text-[10px]">
                v2.4
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1098C7] text-white shadow-xs'
                      : 'text-zinc-300 hover:bg-[#454141] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#1098C7]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-[#454141] space-y-3">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-xs bg-[#454141] text-[#1098C7] font-bold text-xs flex items-center justify-center">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-zinc-400 uppercase font-mono">{user?.role || 'Super Admin'}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#454141]/60 flex items-center justify-between text-xs">
            <button
              onClick={() => navigate('/')}
              className="text-zinc-400 hover:text-[#1098C7] flex items-center gap-1.5 text-[11px] cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 text-[11px] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F7F7F4]">
        {/* Top bar for desktop */}
        <div className="hidden md:flex bg-white border-b border-[#E3E3E0] px-8 py-3.5 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#747474]">
            <span className="font-semibold text-[#302B2B]">Bhagyalaxmi Operations</span>
            <span>/</span>
            <span className="text-[#1098C7] font-medium capitalize">
              {currentPath.replace('/admin', '').replace('/', '') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E8F6FA] text-[#0879A3] rounded-xs font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#1098C7] animate-pulse" />
              <span>Kalaburagi Inventory Live</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 bg-[#F7F7F4] hover:bg-[#E3E3E0] text-[#302B2B] border border-[#E3E3E0] rounded-xs font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#1098C7]" />
              <span>View Public Website</span>
            </button>
          </div>
        </div>

        {/* Child Pages */}
        <div className="p-4 sm:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};
