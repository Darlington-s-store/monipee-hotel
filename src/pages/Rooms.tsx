import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import BookingWidget from '@/components/BookingWidget';
import ScrollAnimation from '@/components/ScrollAnimation';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';
import { useAuth } from '@/contexts/AuthContext';

import heroImage from '@/assets/hero-hotel.jpg';

const Rooms = () => {
  const navigate = useNavigate();
  const { rooms, getHeroSection, settings } = useAuth();
  const hero = getHeroSection('rooms');

  const handleBookRoom = (roomId: string) => {
    navigate(`/booking?room=${roomId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.backgroundImage || heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="relative hotel-container text-center text-primary-foreground">
          <ScrollAnimation>
            <span className="inline-block text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
              {hero.label}
            </span>
          </ScrollAnimation>
          <ScrollAnimation delay={0.1}>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
              {hero.title}
            </h1>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              {hero.subtitle}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Booking Widget */}
      <div className="hotel-container -mt-8 relative z-10 mb-16">
        <ScrollAnimation>
          <BookingWidget />
        </ScrollAnimation>
      </div>

      {/* Rooms Grid */}
      <section className="section-padding pt-8 bg-background">
        <div className="hotel-container">
          <ScrollAnimation>
            <SectionHeader
              subtitle="Choose Your Room"
              title="Comfort Meets Elegance"
              description="Each room is thoughtfully designed to provide maximum comfort and a memorable experience."
            />
          </ScrollAnimation>
          <StaggerContainer className="grid md:grid-cols-2 gap-8">
            {rooms.map((room, index) => (
              <StaggerItem key={`${room.id}-${index}`}>
                <div className="group bg-card rounded-lg overflow-hidden card-hover elegant-shadow">
                  {/* Image */}
                  <Link to={`/rooms/${room.id}`} className="block relative h-64 image-zoom">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      From GH₵{room.price}
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">Free Cancellation</span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Link to={`/rooms/${room.id}`}>
                        <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {room.name}
                        </h3>
                      </Link>
                      <span className="text-sm text-muted-foreground">{room.size}</span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="text-xs px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-serif font-bold text-primary">GH₵{room.price}</span>
                        <span className="text-sm text-muted-foreground"> / night</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/rooms/${room.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          className="btn-primary"
                          size="sm"
                          onClick={() => handleBookRoom(room.id)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Policies */}
      <section className="section-padding bg-secondary">
        <div className="hotel-container">
          <ScrollAnimation>
            <SectionHeader
              subtitle="Good to Know"
              title="Booking Policies"
            />
          </ScrollAnimation>
          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Check-in', info: `From ${settings.checkInTime}` },
              { title: 'Check-out', info: `Until ${settings.checkOutTime}` },
              { title: 'Cancellation', info: 'Free up to 48 hours before' },
            ].map((policy) => (
              <StaggerItem key={policy.title}>
                <div className="text-center p-6 bg-card rounded-lg elegant-shadow">
                  <h3 className="font-serif text-lg font-semibold mb-2">{policy.title}</h3>
                  <p className="text-muted-foreground">{policy.info}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-charcoal text-primary-foreground text-center">
        <div className="hotel-container">
          <ScrollAnimation>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Our reservations team is happy to help you find the perfect room for your needs.
            </p>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <a href="tel:0322495451">
              <Button className="btn-primary px-8">
                Call: 032 249 5451
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </ScrollAnimation>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rooms;
