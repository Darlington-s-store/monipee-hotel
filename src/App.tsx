import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import TawkToChat from "@/components/TawkToChat";
import FloatingContact from "@/components/FloatingContact";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Amenities from "./pages/Amenities";
import Gallery from "./pages/Gallery";
import Reviews from "./pages/Reviews";
import Location from "./pages/Location";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";

// Auth pages
import CustomerAuth from "./pages/auth/CustomerAuth";
import AdminLogin from "./pages/auth/AdminLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Customer dashboard
import CustomerLayout from "./components/dashboard/CustomerLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import MyBookings from "./pages/dashboard/MyBookings";
import Profile from "./pages/dashboard/Profile";
import Messages from "./pages/dashboard/Messages";

// Admin dashboard
import AdminLayout from "./components/dashboard/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminRoomReviews from "./pages/admin/AdminRoomReviews";
import AdminSettings from "./pages/admin/AdminSettings";
import AddRoom from "./pages/admin/AddRoom";
import EditRoom from "./pages/admin/EditRoom";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminHero from "./pages/admin/AdminHero";
import AdminPages from "./pages/admin/AdminPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:roomId" element={<RoomDetail />} />
              <Route path="/amenities" element={<Amenities />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/location" element={<Location />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/booking" element={<Booking />} />

              {/* Auth Routes */}
              <Route path="/auth" element={<CustomerAuth />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Customer Dashboard */}
              <Route path="/dashboard" element={<CustomerLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="messages" element={<Messages />} />
              </Route>

              {/* Admin Dashboard */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="rooms" element={<AdminRooms />} />
                <Route path="rooms/add" element={<AddRoom />} />
                <Route path="rooms/edit/:id" element={<EditRoom />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="room-reviews" element={<AdminRoomReviews />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <TawkToChat />
          <FloatingContact />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
