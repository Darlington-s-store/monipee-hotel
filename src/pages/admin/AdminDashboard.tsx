import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarDays, 
  Users, 
  DollarSign, 
  BedDouble,
  TrendingUp,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { getAllBookings, getAllUsers, getAllMessages } = useAuth();
  
  const bookings = getAllBookings();
  const users = getAllUsers().filter(u => u.role === 'customer');
  const messages = getAllMessages();

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const unreadMessages = messages.filter(m => m.status === 'unread');

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#0b1f3a]">Dashboard</h1>
        <p className="text-[#6b7280] mt-1">Welcome to Monipee Hotel Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#0b1f3a]">Total Revenue</CardTitle>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#111827]">GH₵ {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-[#6b7280]">from all bookings</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#0b1f3a]">Total Bookings</CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#111827]">{bookings.length}</div>
            <p className="text-xs text-[#6b7280]">{pendingBookings.length} pending</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#0b1f3a]">Customers</CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#111827]">{users.length}</div>
            <p className="text-xs text-[#6b7280]">registered users</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#0b1f3a]">Messages</CardTitle>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#111827]">{unreadMessages.length}</div>
            <p className="text-xs text-[#6b7280]">unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#0b1f3a]">Recent Bookings</CardTitle>
            <CardDescription className="text-[#6b7280]">Latest reservation activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-[#6b7280] text-center py-8">No bookings yet</p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-[#fbf8f2] rounded-lg border border-[#efe6d7]">
                    <div>
                      <p className="font-medium text-[#111827]">{booking.guestDetails.firstName} {booking.guestDetails.lastName}</p>
                      <p className="text-sm text-[#6b7280]">{booking.roomName}</p>
                      <p className="text-xs text-[#6b7280]">
                        {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">GH₵ {booking.totalPrice.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-700' 
                          : booking.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-700'
                          : 'bg-red-500/20 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#0b1f3a]">Booking Status Overview</CardTitle>
            <CardDescription className="text-[#6b7280]">Current booking distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#fbf8f2] rounded-lg border border-[#efe6d7]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-[#111827]">Pending</span>
              </div>
              <span className="font-bold text-[#111827]">{pendingBookings.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#fbf8f2] rounded-lg border border-[#efe6d7]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-[#111827]">Confirmed</span>
              </div>
              <span className="font-bold text-[#111827]">{confirmedBookings.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#fbf8f2] rounded-lg border border-[#efe6d7]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-[#111827]">Completed</span>
              </div>
              <span className="font-bold text-[#111827]">{bookings.filter(b => b.status === 'completed').length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#fbf8f2] rounded-lg border border-[#efe6d7]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-[#111827]">Cancelled</span>
              </div>
              <span className="font-bold text-[#111827]">{bookings.filter(b => b.status === 'cancelled').length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
