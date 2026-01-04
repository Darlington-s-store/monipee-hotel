import { useState } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Search, Eye, Mail, Phone } from 'lucide-react';

const AdminCustomers = () => {
  const { getAllUsers, getAllBookings } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  const users = getAllUsers().filter(u => u.role === 'customer');
  const bookings = getAllBookings();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerBookings = (userId: string) => {
    return bookings.filter(b => b.userId === userId);
  };

  const getTotalSpent = (userId: string) => {
    return getCustomerBookings(userId)
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.totalPrice, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#0b1f3a]">Customers</h1>
        <p className="text-[#6b7280] mt-1">Manage registered guests</p>
      </div>

      {/* Search */}
      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#fbf8f2] border-[#efe6d7] text-[#111827] placeholder:text-[#6b7280]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#efe6d7] hover:bg-[#fbf8f2]">
                <TableHead className="text-[#0b1f3a]">Customer</TableHead>
                <TableHead className="text-[#0b1f3a]">Contact</TableHead>
                <TableHead className="text-[#0b1f3a]">Joined</TableHead>
                <TableHead className="text-[#0b1f3a]">Bookings</TableHead>
                <TableHead className="text-[#0b1f3a]">Total Spent</TableHead>
                <TableHead className="text-[#0b1f3a]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#6b7280]">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const customerBookings = getCustomerBookings(user.id);
                  const totalSpent = getTotalSpent(user.id);
                  
                  return (
                    <TableRow key={user.id} className="border-[#efe6d7] hover:bg-[#fbf8f2]">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[#111827]">{user.name}</p>
                            <p className="text-xs text-[#6b7280]">ID: {user.id.slice(0, 12)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-[#111827] flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                          {user.phone && (
                            <p className="text-[#6b7280] flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-[#111827]">
                        {format(new Date(user.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-[#e6dccb] text-[#0b1f3a]">
                          {customerBookings.length} bookings
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        GH₵ {totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-[#6b7280] hover:text-[#0b1f3a]"
                              onClick={() => setSelectedCustomer(user)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white border-[#e6dccb] text-[#111827] max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Customer Details</DialogTitle>
                              <DialogDescription className="text-[#6b7280]">
                                {user.name}'s profile and booking history
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-[#6b7280]">Name</p>
                                  <p className="font-medium">{user.name}</p>
                                </div>
                                <div>
                                  <p className="text-[#6b7280]">Email</p>
                                  <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                  <p className="text-[#6b7280]">Phone</p>
                                  <p className="font-medium">{user.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                  <p className="text-[#6b7280]">Member Since</p>
                                  <p className="font-medium">{format(new Date(user.createdAt), 'PPP')}</p>
                                </div>
                              </div>
                              <hr className="border-[#efe6d7]" />
                              <div>
                                <p className="font-medium mb-2">Booking History ({customerBookings.length})</p>
                                {customerBookings.length === 0 ? (
                                  <p className="text-[#6b7280] text-sm">No bookings yet</p>
                                ) : (
                                  <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {customerBookings.map(booking => (
                                      <div key={booking.id} className="p-2 bg-[#fbf8f2] border border-[#efe6d7] rounded text-sm">
                                        <div className="flex justify-between">
                                          <span>{booking.roomName}</span>
                                          <Badge className={
                                            booking.status === 'confirmed' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : booking.status === 'cancelled'
                                              ? 'bg-red-500/20 text-red-400'
                                              : 'bg-yellow-500/20 text-yellow-400'
                                          }>
                                            {booking.status}
                                          </Badge>
                                        </div>
                                        <p className="text-[#6b7280] text-xs">
                                          {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-between pt-2 border-t border-[#efe6d7]">
                                <span className="text-[#6b7280]">Total Spent</span>
                                <span className="font-bold text-primary">GH₵ {totalSpent.toLocaleString()}</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
