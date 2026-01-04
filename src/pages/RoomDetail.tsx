import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, Users, Maximize, Wifi, Coffee, Tv, Wind, Bath, Sparkles, Car, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollAnimation from '@/components/ScrollAnimation';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';
import { useAuth } from '@/contexts/AuthContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import roomStandard from '@/assets/room-standard.jpg';

const getAmenityIcon = (amenityName: string) => {
  const lower = amenityName.toLowerCase();
  if (lower.includes('wifi') || lower.includes('internet')) return Wifi;
  if (lower.includes('air') || lower.includes('climate')) return Wind;
  if (lower.includes('tv') || lower.includes('screen')) return Tv;
  if (lower.includes('bath') || lower.includes('toilet') || lower.includes('shower') || lower.includes('jacuzzi')) return Bath;
  if (lower.includes('breakfast') || lower.includes('coffee') || lower.includes('tea') || lower.includes('bar') || lower.includes('kitchen')) return Coffee;
  if (lower.includes('cleaning') || lower.includes('housekeeping')) return Sparkles;
  if (lower.includes('parking') || lower.includes('car')) return Car;
  return Check; // Default
};

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { rooms, user, getRoomReviews, addRoomReview, settings } = useAuth();
  const { toast } = useToast();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const [checkIn, setCheckIn] = useState<Date | undefined>(addDays(new Date(), 1));
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 3));
  const [guests, setGuests] = useState('2');

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewJustSubmitted, setReviewJustSubmitted] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }
 
    setCurrent(api.selectedScrollSnap());
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
  const foundRoom = rooms.find(r => r.id === roomId);
  
  // State for non-found room or loading
  if (!foundRoom) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
            <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Adapter to match existing component structure
  const roomImages = foundRoom.images?.map(i => i.dataUrl) || (foundRoom.image ? [foundRoom.image] : []);
  // Ensure at least one image
  if (roomImages.length === 0) roomImages.push(roomStandard);

  const room = {
    ...foundRoom,
    tagline: 'Experience Comfort', 
    maxGuests: foundRoom.capacity,
    bedType: 'Standard Bed', // Default or could be inferred
    view: 'Standard View', // Default
    images: roomImages,
    amenities: foundRoom.amenities.map(name => ({
        icon: getAmenityIcon(name),
        name
    })),
    features: [
        'Premium linens',
        'Private bathroom',
        'In-room safe',
        'Work desk',
        'Tea/coffee making facilities'
    ]
  };

  const roomReviews = getRoomReviews(room.id);
  const ratingSummary = (() => {
    const total = roomReviews.length;
    const avg = total > 0 ? roomReviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
    return { total, avg };
  })();

  const handleSubmitReview = () => {
    if (!user) {
      const params = new URLSearchParams();
      params.set('redirect', `/rooms/${room.id}`);
      navigate(`/auth?${params.toString()}`);
      return;
    }

    const result = addRoomReview(room.id, { rating: reviewRating, comment: reviewComment });
    if (!result.success) {
      toast({
        title: 'Unable to post review',
        description: result.error || 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setReviewRating(5);
    setReviewComment('');
    setReviewJustSubmitted(true);
    toast({
      title: 'Review submitted',
      description: 'Thanks for your feedback. Your review is pending approval and will appear once approved.',
    });
  };

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  const handleBookNow = () => {
    const params = new URLSearchParams({
      room: room.id,
      checkIn: checkIn ? format(checkIn, 'yyyy-MM-dd') : '',
      checkOut: checkOut ? format(checkOut, 'yyyy-MM-dd') : '',
      guests,
    });
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-secondary">
        <div className="hotel-container">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/rooms" className="text-muted-foreground hover:text-primary">Rooms</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{room.name}</span>
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="bg-secondary pb-8">
        <div className="hotel-container">
          <ScrollAnimation>
            <div className="relative rounded-xl overflow-hidden">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {room.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-[400px] md:h-[500px]">
                        <img
                          src={img}
                          alt={`${room.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 px-4 py-2 rounded-full text-sm font-medium z-10">
                {current + 1} / {room.images.length}
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 px-1">
                {room.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={cn(
                      "flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all",
                      current === index ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Room Details */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <ScrollAnimation>
                <span className="text-sm font-medium tracking-[0.2em] uppercase text-primary">
                  {room.tagline}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                  {room.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{room.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Up to {room.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {room.description}
                </p>
              </ScrollAnimation>

              {/* Amenities Grid */}
              <ScrollAnimation delay={0.1}>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Room Amenities</h2>
                <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {room.amenities.map((amenity) => (
                    <StaggerItem key={amenity.name}>
                      <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                        <amenity.icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">{amenity.name}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </ScrollAnimation>

              {/* Features List */}
              <ScrollAnimation delay={0.2}>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Room Features</h2>
                <div className="grid md:grid-cols-2 gap-3 mb-8">
                  {room.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </ScrollAnimation>

              {/* Policies */}
              <ScrollAnimation delay={0.3}>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Policies</h2>
                <div className="bg-secondary rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Check-in / Check-out</h3>
                      <p className="text-sm text-muted-foreground">Check-in from {settings.checkInTime} • Check-out by {settings.checkOutTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Free Cancellation</h3>
                      <p className="text-sm text-muted-foreground">Cancel up to 48 hours before check-in for a full refund</p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Reviews */}
              <ScrollAnimation delay={0.4}>
                <div className="mt-10">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-foreground">Room Reviews</h2>
                      <p className="text-sm text-muted-foreground">Recent feedback from guests who stayed with us.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-serif font-bold text-primary">
                          {ratingSummary.total > 0 ? ratingSummary.avg.toFixed(1) : '—'}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-4 h-4',
                                i < Math.round(ratingSummary.avg) ? 'text-primary fill-primary' : 'text-muted'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ratingSummary.total} review{ratingSummary.total === 1 ? '' : 's'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl p-6 elegant-shadow">
                    {!user ? (
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">Sign in to write a review</p>
                          <p className="text-sm text-muted-foreground">You must be logged in to submit feedback for this room.</p>
                        </div>
                        <Link to={`/auth?redirect=${encodeURIComponent(`/rooms/${room.id}`)}`}>
                          <Button className="btn-primary">Log in / Register</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">Leave a review</p>
                            <p className="text-sm text-muted-foreground">Signed in as {user.name}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="p-1"
                                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                              >
                                <Star
                                  className={cn(
                                    'w-5 h-5',
                                    star <= reviewRating ? 'text-primary fill-primary' : 'text-muted'
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <Textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this room..."
                          rows={4}
                        />

                        {reviewJustSubmitted && (
                          <div className="text-sm text-muted-foreground bg-secondary rounded-md p-3">
                            Your review has been submitted and is <span className="font-medium text-foreground">pending approval</span>.
                          </div>
                        )}

                        <div className="flex items-center justify-end">
                          <Button
                            className="btn-primary"
                            onClick={handleSubmitReview}
                            disabled={!reviewComment.trim()}
                          >
                            Post Review
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-4">
                    {roomReviews.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No reviews yet. Be the first to share your experience.</div>
                    ) : (
                      roomReviews.map((r) => (
                        <div key={r.id} className="bg-secondary rounded-lg p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">{r.userName}</p>
                                <span className="text-xs text-muted-foreground">{format(new Date(r.createdAt), 'PPP')}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn('w-4 h-4', i < r.rating ? 'text-primary fill-primary' : 'text-muted')}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground mt-3 leading-relaxed">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <ScrollAnimation delay={0.2}>
                <div className="bg-card rounded-xl p-6 elegant-shadow sticky top-24">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-serif font-bold text-primary">GH₵{room.price}</span>
                    <span className="text-muted-foreground">/ night</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Check-in</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !checkIn && 'text-muted-foreground'
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {checkIn ? format(checkIn, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Check-out</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !checkOut && 'text-muted-foreground'
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {checkOut ? format(checkOut, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            disabled={(date) => date < (checkIn || new Date())}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Guests</label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button className="w-full btn-primary" onClick={handleBookNow}>
                    Book Now
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    You won't be charged yet
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RoomDetail;