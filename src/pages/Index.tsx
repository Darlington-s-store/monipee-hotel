import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Star, Wifi, Car, Coffee, Waves, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingWidget from '@/components/BookingWidget';
import RoomCard from '@/components/RoomCard';
import AmenityCard from '@/components/AmenityCard';
import ReviewCard from '@/components/ReviewCard';
import SectionHeader from '@/components/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

import heroImage from '@/assets/hero-hotel.jpg';
import poolImage from '@/assets/pool.jpg';

const Index = () => {
  const { getHeroSection, getPageContent, galleryImages, rooms, reviews, user, addRoomReview, getAllRoomReviews, settings } = useAuth();
  const hero = getHeroSection('home');
  const homeContent = getPageContent('home');

  const { toast } = useToast();
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewJustSubmitted, setReviewJustSubmitted] = useState(false);

  const roomsPreview = rooms.slice(0, 3);

  const amenities = [
    {
      icon: Wifi,
      title: homeContent.content.amenitiesCardWifiTitle || 'Free Wi-Fi',
      description: homeContent.content.amenitiesCardWifiDescription || 'High-speed internet throughout the hotel',
    },
    {
      icon: Coffee,
      title: homeContent.content.amenitiesCardBreakfastTitle || 'Free Breakfast',
      description: homeContent.content.amenitiesCardBreakfastDescription || 'Complimentary daily breakfast buffet',
    },
    {
      icon: Car,
      title: homeContent.content.amenitiesCardParkingTitle || 'Free Parking',
      description: homeContent.content.amenitiesCardParkingDescription || 'Secure on-site parking for all guests',
    },
    {
      icon: Waves,
      title: homeContent.content.amenitiesCardPoolTitle || 'Swimming Pool',
      description: homeContent.content.amenitiesCardPoolDescription || 'Outdoor pool with poolside service',
    },
  ];

  const publishedReviews = reviews.filter((r) => r.status === 'published').slice(0, 3);

  const heroRating = Math.max(0, Math.min(5, Number(homeContent.content.heroRating) || 0));
  const heroReviewCount = Math.max(0, Number(homeContent.content.heroReviewCount) || 0);
  const heroStartingPrice = homeContent.content.heroStartingPrice || '';

  const latestApprovedRoomReviews = getAllRoomReviews().filter((r) => r.status === 'approved').slice(0, 3);

  const selectedRoomName = useMemo(() => {
    const found = rooms.find((r) => r.id === selectedRoomId);
    return found?.name || '';
  }, [rooms, selectedRoomId]);

  const handleSubmitRoomReview = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please log in or create an account to submit a review.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedRoomId) {
      toast({
        title: 'Select a room',
        description: 'Please choose the room you want to review.',
        variant: 'destructive',
      });
      return;
    }

    const result = addRoomReview(selectedRoomId, { rating: reviewRating, comment: reviewComment });
    if (!result.success) {
      toast({
        title: 'Unable to submit review',
        description: result.error || 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setReviewComment('');
    setReviewRating(5);
    setReviewJustSubmitted(true);
    toast({
      title: 'Review submitted',
      description: 'Thanks for your feedback. Your review is pending approval and will appear once approved.',
    });
  };

  const renderStarPicker = () => (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setReviewRating(star)}
            className="p-0.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`Set rating to ${star}`}
          >
            <Star className={`w-5 h-5 ${star <= reviewRating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">{reviewRating} / 5</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.backgroundImage || heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>

        <div className="relative hotel-container text-center text-primary-foreground">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <span className="inline-block text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
              {hero.label}
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {hero.title.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < hero.title.split("\n").length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 max-w-2xl mx-auto">
              {hero.subtitle}
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(heroRating) ? 'text-primary fill-primary' : 'text-primary/50'}`}
                  />
                ))}
              </div>
              <span className="text-primary-foreground/80">{heroRating.toFixed(1)} • {heroReviewCount} reviews</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/rooms">
                <Button className="btn-primary px-8 py-6 text-lg">
                  Book Your Stay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <div className="text-primary-foreground">
                <span className="text-sm">Rooms from</span>
                <span className="block text-3xl font-serif font-bold text-primary">{settings.currency}{heroStartingPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Widget - Desktop */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 hidden lg:block">
          <div className="hotel-container">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* Booking Widget - Mobile */}
      <div className="lg:hidden hotel-container -mt-8 relative z-10">
        <BookingWidget />
      </div>

      {/* About Preview */}
      <section className="section-padding bg-secondary">
        <div className="hotel-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden elegant-shadow">
                <img
                  src={homeContent.images.aboutPreview || poolImage}
                  alt="Monipee Hotel Pool"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg hidden md:block">
                <span className="block text-4xl font-serif font-bold">15+</span>
                <span className="text-sm">Years of Excellence</span>
              </div>
            </div>
            <div>
              <SectionHeader
                subtitle={homeContent.content.aboutPreviewSubtitle || 'Welcome'}
                title={homeContent.content.aboutPreviewTitle || 'A Haven of Comfort in Ghana'}
                description={homeContent.content.aboutPreviewDescription || 'Nestled in the heart of Ahansowodee, Monipee Hotel offers a perfect blend of traditional Ghanaian hospitality and modern luxury.'}
                centered={false}
              />
              <p className="text-muted-foreground mb-6">
                {homeContent.content.aboutPreviewBody || "Whether you're traveling for business or leisure, our dedicated team ensures every moment of your stay is memorable. From our elegantly appointed rooms to our world-class amenities, experience hospitality that exceeds expectations."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/about">
                  <Button variant="outline" className="btn-outline-gold">
                    Learn More About Us
                  </Button>
                </Link>
                <Link to="/amenities">
                  <Button className="btn-primary">
                    View Amenities
                  </Button>
                </Link>
              </div>
            </div>
          </div>
      </div>
      </section>

      {/* Rooms Preview */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <SectionHeader
            subtitle="Accommodations"
            title="Our Rooms & Suites"
            description="Choose from our selection of thoughtfully designed rooms, each offering comfort and elegance."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomsPreview.map((room) => (
              <RoomCard
                key={room.id}
                id={room.id}
                image={room.image}
                name={room.name}
                description={room.description}
                price={room.price}
                amenities={room.amenities}
                size={room.size}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/rooms">
              <Button className="btn-primary px-8">
                View All Rooms
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities Preview */}
      <section className="section-padding bg-charcoal">
        <div className="hotel-container">
          <SectionHeader
            subtitle={homeContent.content.amenitiesPreviewSubtitle || 'Amenities'}
            title={homeContent.content.amenitiesPreviewTitle || 'Exceptional Facilities'}
            description={homeContent.content.amenitiesPreviewDescription || 'Enjoy our comprehensive range of amenities designed for your comfort and convenience.'}
            light
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {amenities.map((amenity) => (
              <AmenityCard key={amenity.title} {...amenity} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/amenities">
              <Button className="btn-primary px-8">
                Explore All Amenities
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <SectionHeader
            subtitle={homeContent.content.galleryPreviewSubtitle || 'Gallery'}
            title={homeContent.content.galleryPreviewTitle || 'A Glimpse of Monipee'}
            description={homeContent.content.galleryPreviewDescription || 'Explore highlights from our rooms, amenities, dining, and exterior.'}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.slice(0, 8).map((img) => (
              <div key={img.id} className="relative aspect-[4/3] rounded-lg overflow-hidden image-zoom">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery">
              <Button className="btn-primary px-8">
                View Full Gallery
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Preview */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <SectionHeader
            subtitle="Testimonials"
            title="What Our Guests Say"
            description="Hear from travelers who have experienced Monipee Hotel hospitality."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {publishedReviews.map((review) => (
              <ReviewCard key={review.id} name={review.name} date={review.date} rating={review.rating} comment={review.comment} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/reviews">
              <Button variant="outline" className="btn-outline-gold px-8">
                Read All Reviews
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Write a Room Review */}
      <section className="section-padding bg-secondary">
        <div className="hotel-container">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <SectionHeader
                subtitle="Feedback"
                title="Write a Room Review"
                description="Help other guests by sharing your experience. Reviews are moderated and will appear once approved."
                centered={false}
              />
              <p className="text-muted-foreground">
                Your feedback helps us improve and helps future guests choose the right room.
              </p>
            </div>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Submit your review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Please sign in to write a review.
                    </p>
                    <Link to="/auth">
                      <Button className="btn-primary">Log in / Register</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Room</p>
                      <Select value={selectedRoomId} onValueChange={(v) => { setSelectedRoomId(v); setReviewJustSubmitted(false); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedRoomName ? (
                        <p className="mt-1 text-xs text-muted-foreground">Reviewing: {selectedRoomName}</p>
                      ) : null}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Rating</p>
                      {renderStarPicker()}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Your review</p>
                      <Textarea
                        value={reviewComment}
                        onChange={(e) => { setReviewComment(e.target.value); setReviewJustSubmitted(false); }}
                        placeholder="Share what you liked and what could be improved..."
                        rows={4}
                      />
                    </div>

                    {reviewJustSubmitted && (
                      <div className="text-sm text-muted-foreground bg-background rounded-md p-3 border border-border">
                        Submitted successfully. Your review is <span className="font-medium text-foreground">pending approval</span>.
                      </div>
                    )}

                    <div className="flex items-center justify-end">
                      <Button
                        className="btn-primary"
                        onClick={handleSubmitRoomReview}
                        disabled={!selectedRoomId || !reviewComment.trim()}
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {latestApprovedRoomReviews.length > 0 && (
            <div className="mt-12">
              <SectionHeader
                subtitle="Recently Approved"
                title="Latest Room Reviews"
                description="Verified, approved feedback from recent guests."
              />
              <div className="grid md:grid-cols-3 gap-8">
                {latestApprovedRoomReviews.map((r) => (
                  <div key={r.id} className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{rooms.find((rm) => rm.id === r.roomId)?.name || 'Room'}</span>
                      <span className="text-muted-foreground"> • {format(new Date(r.createdAt), 'PPP')}</span>
                    </div>
                    <ReviewCard
                      name={r.userName}
                      date={format(new Date(r.createdAt), 'PPP')}
                      rating={r.rating}
                      comment={r.comment}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-charcoal/80" />
        </div>
        <div className="relative hotel-container text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Experience <span className="text-primary">Luxury</span>?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Book your stay today and discover why guests choose Monipee Hotel for unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/rooms">
              <Button className="btn-primary px-8 py-6 text-lg">
                Book Now
              </Button>
            </Link>
            <a href="tel:0322495451">
              <Button variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-charcoal px-8 py-6 text-lg">
                Call: 032 249 5451
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
