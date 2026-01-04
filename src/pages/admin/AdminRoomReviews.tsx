import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Star, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const AdminRoomReviews = () => {
  const { getAllRoomReviews, updateRoomReviewStatus, rooms } = useAuth();

  const roomNameById = useMemo(() => {
    const map = new Map<string, string>();
    rooms.forEach((r) => map.set(r.id, r.name));
    return map;
  }, [rooms]);

  const reviews = getAllRoomReviews();

  const stats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((r) => r.status === 'pending').length;
    const approved = reviews.filter((r) => r.status === 'approved').length;
    const rejected = reviews.filter((r) => r.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [reviews]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-[#d1c4b3]'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0b1f3a]">Room Reviews</h1>
          <p className="text-[#6b7280] mt-1">Moderate customer reviews before they appear publicly.</p>
        </div>
        <Link to="/rooms">
          <Button variant="outline" className="border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]">View Public Rooms</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-[#6b7280]">Total</p>
              <p className="text-3xl font-bold text-[#111827]">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280]">Pending</p>
                <p className="text-3xl font-bold text-[#111827]">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280]">Approved</p>
                <p className="text-3xl font-bold text-[#111827]">{stats.approved}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280]">Rejected</p>
                <p className="text-3xl font-bold text-[#111827]">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#0b1f3a]">All Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-[#6b7280]">No room reviews have been submitted yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-5 rounded-lg bg-[#fbf8f2] border border-[#efe6d7]">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-[#111827]">{r.userName}</p>
                      {getStatusBadge(r.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      {renderStars(r.rating)}
                      <span className="text-sm text-[#6b7280]">Room:</span>
                      <span className="text-sm text-[#111827]">{roomNameById.get(r.roomId) || r.roomId}</span>
                      <span className="text-[#6b7280]">•</span>
                      <span className="text-sm text-[#6b7280]">{format(new Date(r.createdAt), 'PPP')}</span>
                    </div>

                    <p className="text-[#374151] whitespace-pre-wrap">{r.comment}</p>
                  </div>

                  <div className="flex gap-2">
                    {r.status !== 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => updateRoomReviewStatus(r.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                    )}
                    {r.status !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateRoomReviewStatus(r.id, 'rejected')}
                        className="border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]"
                      >
                        Reject
                      </Button>
                    )}
                    {r.status !== 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateRoomReviewStatus(r.id, 'pending')}
                        className="border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]"
                      >
                        Set Pending
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRoomReviews;
