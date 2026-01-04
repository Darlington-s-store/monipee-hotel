import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Trash2 } from 'lucide-react';
import { useAuth, Review } from '@/contexts/AuthContext';

const AdminReviews = () => {
  const { reviews, addReview, updateReview, deleteReview } = useAuth();

  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState<Review['status']>('published');

  const handleStatusChange = (reviewId: string, status: Review['status']) => {
    updateReview(reviewId, { status });
  };

  const handleDelete = (reviewId: string) => {
    deleteReview(reviewId);
  };

  const handleAdd = () => {
    const name = newName.trim();
    const date = newDate.trim();
    const comment = newComment.trim();

    if (!name || !date || !comment) return;

    addReview({
      name,
      date,
      rating: Math.max(1, Math.min(5, Number(newRating) || 5)),
      comment,
      status: newStatus,
    });

    setNewName('');
    setNewDate('');
    setNewRating(5);
    setNewComment('');
    setNewStatus('published');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'hidden':
        return <Badge className="bg-[#f1eadf] text-[#6b7280] border-[#e6dccb]">Hidden</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-[#d1c4b3]'}`}
          />
        ))}
      </div>
    );
  };

  const stats = useMemo(() => {
    const total = reviews.length;
    const published = reviews.filter(r => r.status === 'published');
    const avg = published.length > 0
      ? (published.reduce((sum, r) => sum + r.rating, 0) / published.length).toFixed(1)
      : '0';
    const pending = reviews.filter(r => r.status === 'pending').length;
    return { total, avg, pending };
  }, [reviews]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#0b1f3a]">Reviews</h1>
        <p className="text-[#6b7280] mt-1">Manage guest reviews and ratings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280]">Average Rating</p>
                <p className="text-3xl font-bold text-[#111827]">{stats.avg}</p>
              </div>
              <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-[#6b7280]">Total Reviews</p>
              <p className="text-3xl font-bold text-[#111827]">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-[#6b7280]">Pending Approval</p>
              <p className="text-3xl font-bold text-[#111827]">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Review */}
      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#0b1f3a]">Add Review</CardTitle>
          <CardDescription className="text-[#6b7280]">Create a new review and choose its visibility.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#111827]">Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                placeholder="Guest name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#111827]">Date</Label>
              <Input
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                placeholder="e.g. December 2024 or 2 years ago"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#111827]">Rating (1-5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#111827]">Status</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={newStatus === 'published' ? 'default' : 'outline'}
                  onClick={() => setNewStatus('published')}
                  className={newStatus === 'published' ? 'bg-green-600 hover:bg-green-700' : 'border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]'}
                >
                  Published
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={newStatus === 'pending' ? 'default' : 'outline'}
                  onClick={() => setNewStatus('pending')}
                  className={newStatus === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]'}
                >
                  Pending
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={newStatus === 'hidden' ? 'default' : 'outline'}
                  onClick={() => setNewStatus('hidden')}
                  className={newStatus === 'hidden' ? 'bg-[#0b1f3a] hover:bg-[#143a63] text-white' : 'border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]'}
                >
                  Hidden
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#111827]">Comment</Label>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
              rows={4}
              placeholder="Write the review..."
            />
          </div>

          <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
            Add Review
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-white border-[#e6dccb] shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-[#111827]">{review.name}</p>
                    {getStatusBadge(review.status)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">{renderStars(review.rating)}</div>
                  <p className="text-[#374151]">{review.comment}</p>
                  <p className="text-sm text-[#6b7280] mt-2">
                    {review.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  {review.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusChange(review.id, 'published')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  )}
                  {review.status === 'published' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusChange(review.id, 'hidden')}
                      className="border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]"
                    >
                      Hide
                    </Button>
                  )}
                  {review.status === 'hidden' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusChange(review.id, 'published')}
                      className="border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]"
                    >
                      Show
                    </Button>
                  )}
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => handleDelete(review.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
