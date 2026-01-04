import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Users, Edit, Plus, Trash2, Calendar, Check } from 'lucide-react';
import { useAuth, Room, Booking } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const AdminRooms = () => {
  const { toast } = useToast();
  const { rooms, updateRoom, deleteRoom, getAllBookings, updateBooking } = useAuth();
  const navigate = useNavigate();
  
  // Calculate booking stats for a room
  const getRoomStats = (roomId: string, roomName: string) => {
    const allBookings = getAllBookings();
    const roomBookings = allBookings.filter(
      b => b.roomType === roomId || b.roomName === roomName
    );
    return {
      total: roomBookings.length,
      pending: roomBookings.filter(b => b.status === 'pending').length
    };
  };

  const [isBookingsDialogOpen, setIsBookingsDialogOpen] = useState(false);
  const [selectedRoomBookings, setSelectedRoomBookings] = useState<{ room: Room, bookings: Booking[] } | null>(null);

  const handleToggleAvailability = (roomId: string, currentStatus: boolean) => {
    updateRoom(roomId, { available: !currentStatus });
    toast({
      title: 'Room Updated',
      description: 'Room availability has been updated.',
    });
  };

  const handleEditRoom = (room: Room) => {
    navigate(`/admin/rooms/edit/${room.id}`);
  };

  const handleAddRoom = () => {
    navigate('/admin/rooms/add');
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      deleteRoom(roomId);
      toast({
        title: 'Room Deleted',
        description: 'The room has been removed from the system.',
        variant: 'destructive',
      });
    }
  };

  const handleViewBookings = (room: Room) => {
    const allBookings = getAllBookings();
    // Filter bookings for this room type
    // We check both roomType (id) and roomName to be safe
    const roomBookings = allBookings.filter(
      b => b.roomType === room.id || b.roomName === room.name
    );
    setSelectedRoomBookings({ room, bookings: roomBookings });
    setIsBookingsDialogOpen(true);
  };

  const handleApproveBooking = (bookingId: string) => {
    updateBooking(bookingId, { status: 'confirmed' });
    
    // Update local state to reflect change immediately in the dialog
    if (selectedRoomBookings) {
      const updatedBookings = selectedRoomBookings.bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'confirmed' as const } : b
      );
      setSelectedRoomBookings({ ...selectedRoomBookings, bookings: updatedBookings });
    }

    toast({
      title: 'Booking Approved',
      description: 'The booking has been confirmed.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      default: return 'bg-[#f1eadf] text-[#6b7280] hover:bg-[#eaddcf]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0b1f3a]">Rooms Management</h1>
          <p className="text-[#6b7280] mt-1">Manage hotel rooms, availability, and view associated bookings</p>
        </div>
        <Button onClick={handleAddRoom} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Room
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="bg-white border-[#e6dccb] shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-48">
              <img 
                src={room.image} 
                alt={room.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop';
                }}
              />
              <Badge 
                className={`absolute top-3 right-3 ${
                  room.available 
                    ? 'bg-green-500/90 text-white' 
                    : 'bg-red-500/90 text-white'
                }`}
              >
                {room.available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-[#0b1f3a] text-xl">{room.name}</CardTitle>
                <Badge variant="outline" className="text-xs border-[#e6dccb] text-[#6b7280]">
                  ID: {room.id}
                </Badge>
              </div>
              <CardDescription className="text-[#6b7280] line-clamp-2">{room.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#374151]">
                  <Users className="w-4 h-4" />
                  <span>Max {room.capacity} guests</span>
                </div>
                <p className="text-xl font-bold text-primary">GH₵ {room.price}<span className="text-sm font-normal text-[#6b7280]">/night</span></p>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {room.amenities.slice(0, 3).map((amenity, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs border-[#e6dccb] text-[#0b1f3a]">
                    {amenity}
                  </Badge>
                ))}
                {room.amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs border-[#e6dccb] text-[#0b1f3a]">
                    +{room.amenities.length - 3}
                  </Badge>
                )}
              </div>

              {/* Booking Stats */}
              <div className="pt-2 flex gap-3 text-sm text-[#6b7280]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{getRoomStats(room.id, room.name).total} Total Bookings</span>
                </div>
              </div>
            </CardContent>
            
            <div className="p-6 pt-0 mt-auto space-y-3">
              <div className="flex items-center justify-between pt-4 border-t border-[#efe6d7]">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={room.available}
                    onCheckedChange={() => handleToggleAvailability(room.id, room.available)}
                  />
                  <span className="text-sm text-[#6b7280]">Active</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditRoom(room)}
                    className="text-[#6b7280] hover:text-[#0b1f3a] hover:bg-[#f1eadf]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteRoom(room.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="w-full bg-[#0b1f3a] hover:bg-[#143a63] text-white"
                onClick={() => handleViewBookings(room)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Bookings
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* View Bookings Dialog */}
      <Dialog open={isBookingsDialogOpen} onOpenChange={setIsBookingsDialogOpen}>
        <DialogContent className="bg-white border-[#e6dccb] text-[#111827] max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Bookings for {selectedRoomBookings?.room.name}</DialogTitle>
            <DialogDescription className="text-[#6b7280]">
              Manage customer bookings for this room type
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-grow overflow-y-auto mt-4">
            {!selectedRoomBookings?.bookings.length ? (
              <div className="text-center py-12 text-[#6b7280]">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No bookings found for this room type.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#efe6d7] hover:bg-transparent">
                    <TableHead className="text-[#0b1f3a]">Guest</TableHead>
                    <TableHead className="text-[#0b1f3a]">Dates</TableHead>
                    <TableHead className="text-[#0b1f3a]">Guests</TableHead>
                    <TableHead className="text-[#0b1f3a]">Total</TableHead>
                    <TableHead className="text-[#0b1f3a]">Status</TableHead>
                    <TableHead className="text-[#0b1f3a] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedRoomBookings.bookings.map((booking) => (
                    <TableRow key={booking.id} className="border-[#efe6d7] hover:bg-[#fbf8f2]">
                      <TableCell className="font-medium">
                        <div>{booking.guestDetails.firstName} {booking.guestDetails.lastName}</div>
                        <div className="text-xs text-[#6b7280]">{booking.guestDetails.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>{booking.guests}</TableCell>
                      <TableCell>GH₵ {booking.totalPrice}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {booking.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white h-8"
                            onClick={() => handleApproveBooking(booking.id)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRooms;
