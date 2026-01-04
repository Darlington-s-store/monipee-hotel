import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { CalendarDays, Users, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { sendBookingStatusUpdate } from '@/lib/emailService';

const MyBookings = () => {
  const { getBookings, updateBooking } = useAuth();
  const { toast } = useToast();
  const bookings = getBookings();

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      sendBookingStatusUpdate({
        guestName: `${booking.guestDetails.firstName} ${booking.guestDetails.lastName}`,
        guestEmail: booking.guestDetails.email,
        bookingId: booking.id,
        status: 'cancelled',
        roomName: booking.roomName,
        checkIn: format(new Date(booking.checkIn), 'PPP'),
        checkOut: format(new Date(booking.checkOut), 'PPP'),
        total: `GH₵${booking.totalPrice.toFixed(2)}`,
      });
    }
    updateBooking(bookingId, { status: 'cancelled' });
    toast({
      title: 'Booking Cancelled',
      description: 'Your booking has been cancelled successfully.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const upcomingBookings = bookings.filter(b => 
    new Date(b.checkIn) >= new Date() && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(b => 
    new Date(b.checkOut) < new Date() || b.status === 'cancelled'
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage your reservations</p>
        </div>
        <Link to="/booking">
          <Button className="btn-primary">
            <CalendarDays className="w-4 h-4 mr-2" />
            Book New Stay
          </Button>
        </Link>
      </div>

      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Reservations</h2>
        {upcomingBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No upcoming reservations</p>
              <Link to="/booking">
                <Button>Book Your Stay</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingBookings.map((booking) => {
              const nights = differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn));
              return (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{booking.roomName}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                          </span>
                          <span>• {nights} night{nights > 1 ? 's' : ''}</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          GH₵ {booking.totalPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">View Details</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{booking.roomName}</DialogTitle>
                              <DialogDescription>Booking Reference: {booking.id}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Check-in</p>
                                  <p className="font-medium">{format(new Date(booking.checkIn), 'PPP')}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Check-out</p>
                                  <p className="font-medium">{format(new Date(booking.checkOut), 'PPP')}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Guests</p>
                                  <p className="font-medium">{booking.guests}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Total</p>
                                  <p className="font-medium">GH₵ {booking.totalPrice.toLocaleString()}</p>
                                </div>
                              </div>
                              <hr />
                              <div>
                                <p className="text-muted-foreground text-sm">Guest Details</p>
                                <p className="font-medium">{booking.guestDetails.firstName} {booking.guestDetails.lastName}</p>
                                <p className="text-sm">{booking.guestDetails.email}</p>
                                <p className="text-sm">{booking.guestDetails.phone}</p>
                              </div>
                              {booking.guestDetails.specialRequests && (
                                <div>
                                  <p className="text-muted-foreground text-sm">Special Requests</p>
                                  <p className="text-sm">{booking.guestDetails.specialRequests}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {booking.status !== 'cancelled' && (
                          <Button 
                            variant="destructive" 
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past & Cancelled Bookings</h2>
          <div className="grid gap-4">
            {pastBookings.map((booking) => {
              const nights = differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn));
              return (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{booking.roomName}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                          </span>
                          <span>• {nights} night{nights > 1 ? 's' : ''}</span>
                        </div>
                        <p className="text-lg font-bold">
                          GH₵ {booking.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
