import { useState } from 'react';
import { useAuth, Booking } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { sendBookingStatusUpdate } from '@/lib/emailService';

const AdminBookings = () => {
  const { getAllBookings, updateBooking } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const bookings = getAllBookings();

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.guestDetails.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestDetails.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      sendBookingStatusUpdate({
        guestName: `${booking.guestDetails.firstName} ${booking.guestDetails.lastName}`,
        guestEmail: booking.guestDetails.email,
        bookingId: booking.id,
        status: newStatus,
        roomName: booking.roomName,
        checkIn: format(new Date(booking.checkIn), 'PPP'),
        checkOut: format(new Date(booking.checkOut), 'PPP'),
        total: `GH₵${booking.totalPrice.toFixed(2)}`,
      });
    }
    updateBooking(bookingId, { status: newStatus });
    toast({
      title: 'Booking Updated',
      description: `Booking status changed to ${newStatus}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return styles[status as keyof typeof styles] || '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#0b1f3a]">Bookings</h1>
        <p className="text-[#6b7280] mt-1">Manage all hotel reservations</p>
      </div>

      {/* Filters */}
      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <Input
                placeholder="Search by guest name, email, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#fbf8f2] border-[#efe6d7] text-[#111827] placeholder:text-[#6b7280]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[#fbf8f2] border-[#efe6d7] text-[#111827]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#e6dccb]">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#efe6d7] hover:bg-[#fbf8f2]">
                <TableHead className="text-[#0b1f3a]">Booking ID</TableHead>
                <TableHead className="text-[#0b1f3a]">Guest</TableHead>
                <TableHead className="text-[#0b1f3a]">Room</TableHead>
                <TableHead className="text-[#0b1f3a]">Dates</TableHead>
                <TableHead className="text-[#0b1f3a]">Total</TableHead>
                <TableHead className="text-[#0b1f3a]">Status</TableHead>
                <TableHead className="text-[#0b1f3a]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#6b7280]">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="border-[#efe6d7] hover:bg-[#fbf8f2]">
                    <TableCell className="font-mono text-xs text-[#6b7280]">
                      {booking.id.slice(0, 12)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#111827]">
                          {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                        </p>
                        <p className="text-xs text-[#6b7280]">{booking.guestDetails.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#111827]">{booking.roomName}</TableCell>
                    <TableCell className="text-[#111827]">
                      <p>{format(new Date(booking.checkIn), 'MMM d')}</p>
                      <p className="text-xs text-[#6b7280]">to {format(new Date(booking.checkOut), 'MMM d, yyyy')}</p>
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      GH₵ {booking.totalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-[#6b7280] hover:text-[#0b1f3a]"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white border-[#e6dccb] text-[#111827]">
                            <DialogHeader>
                              <DialogTitle>Booking Details</DialogTitle>
                              <DialogDescription className="text-[#6b7280]">
                                Reference: {booking.id}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-[#6b7280]">Guest</p>
                                  <p className="font-medium">{booking.guestDetails.firstName} {booking.guestDetails.lastName}</p>
                                </div>
                                <div>
                                  <p className="text-[#6b7280]">Email</p>
                                  <p className="font-medium">{booking.guestDetails.email}</p>
                                </div>
                                <div>
                                  <p className="text-[#6b7280]">Phone</p>
                                  <p className="font-medium">{booking.guestDetails.phone}</p>
                                </div>
                                <div>
                                  <p className="text-[#6b7280]">Room</p>
                                  <p className="font-medium">{booking.roomName}</p>
                                </div>
                                <div>
                                  <p className="text-[#6b7280]">Check-in</p>
                                  <p className="font-medium">{format(new Date(booking.checkIn), 'PPP')}</p>
                                </div>
                                <div>
                                  <p className="text-[#6b7280]">Check-out</p>
                                  <p className="font-medium">{format(new Date(booking.checkOut), 'PPP')}</p>
                                </div>
                                <div>
                                  <p className="text-[#6b7280]">Guests</p>
                                  <p className="font-medium">{booking.guests}</p>
                                </div>
                                <div>
                                  <p className="text-[#6b7280]">Total</p>
                                  <p className="font-medium text-primary">GH₵ {booking.totalPrice.toLocaleString()}</p>
                                </div>
                              </div>
                              {booking.guestDetails.specialRequests && (
                                <div>
                                  <p className="text-[#6b7280] text-sm">Special Requests</p>
                                  <p className="text-sm">{booking.guestDetails.specialRequests}</p>
                                </div>
                              )}
                              <div className="flex gap-2 pt-4">
                                <Button 
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                  onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                  disabled={booking.status === 'confirmed'}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Confirm
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  className="flex-1"
                                  onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                  disabled={booking.status === 'cancelled'}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {booking.status === 'pending' && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
