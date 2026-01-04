import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BedDouble,
  Users, 
  MessageSquare, 
  Star,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  Bell,
  Image
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
  { name: 'Rooms', path: '/admin/rooms', icon: BedDouble },
  { name: 'Gallery', path: '/admin/gallery', icon: Image },
  { name: 'Hero', path: '/admin/hero', icon: Image },
  { name: 'Pages', path: '/admin/pages', icon: Settings },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Reviews', path: '/admin/reviews', icon: Star },
  { name: 'Room Reviews', path: '/admin/room-reviews', icon: Star },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
  const { user, isLoading, logout, getAllMessages } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadMessages = getAllMessages().filter(m => m.status === 'unread').length;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    }
    if (!isLoading && user?.role !== 'admin') {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f2e9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#f7f2e9] text-[#1f2937] overflow-y-scroll">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e6dccb]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-[#f1eadf] rounded-lg transition-colors"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                } else {
                  setIsSidebarOpen(!isSidebarOpen);
                }
              }}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <div className="hidden sm:block">
                <span className="font-serif text-xl font-bold">MONIPEE</span>
                <span className="text-xs tracking-[0.2em] uppercase text-primary ml-2">Admin</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Button>
            <ThemeToggle isScrolled={true} />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-[#6b7280]">Administrator</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-[65px]">
        {/* Sidebar - Desktop */}
        <aside 
          className={`hidden lg:block fixed left-0 top-[65px] h-[calc(100vh-65px)] bg-[#0b1f3a] border-r border-[#0b1f3a] transition-[width] duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-white/15 text-white' 
                      : 'hover:bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isSidebarOpen && <span>{item.name}</span>}
                  {item.name === 'Messages' && unreadMessages > 0 && isSidebarOpen && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              );
            })}
            <hr className="my-4 border-white/10" />
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span>View Website</span>}
            </Link>
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[65px] z-40 bg-[#0b1f3a]/95 backdrop-blur-sm">
            <div className="flex justify-end p-4">
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-white/15 text-white' 
                        : 'hover:bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 p-4 lg:p-8 min-h-[calc(100vh-65px)] bg-[#f7f2e9] transition-[padding-left] duration-300 lg:pl-8 ${
            isSidebarOpen ? 'lg:pl-[17rem]' : 'lg:pl-[7rem]'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
