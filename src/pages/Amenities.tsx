import { Wifi, Car, Coffee, Waves, Dumbbell, UtensilsCrossed, Wind, Tv, ShowerHead, Shield, Clock, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ScrollAnimation from '@/components/ScrollAnimation';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';
import { useAuth } from '@/contexts/AuthContext';

import heroImage from '@/assets/hero-hotel.jpg';
import poolImage from '@/assets/pool.jpg';
import restaurantImage from '@/assets/restaurant.jpg';

const Amenities = () => {
  const { getHeroSection, getPageContent } = useAuth();
  const hero = getHeroSection('amenities');
  const amenitiesContent = getPageContent('amenities');

  const mainAmenities = [
    {
      icon: Wifi,
      title: 'Free High-Speed Wi-Fi',
      description: 'Stay connected with complimentary high-speed internet access throughout the hotel, including all guest rooms and common areas.',
    },
    {
      icon: Coffee,
      title: 'Complimentary Breakfast',
      description: 'Start your day with our delicious breakfast buffet featuring both local Ghanaian dishes and international favorites.',
    },
    {
      icon: Car,
      title: 'Free Secure Parking',
      description: 'Enjoy peace of mind with our complimentary on-site parking facility with 24/7 security surveillance.',
    },
    {
      icon: Waves,
      title: 'Swimming Pool',
      description: 'Take a refreshing dip in our outdoor swimming pool, complete with comfortable loungers and poolside service.',
    },
    {
      icon: UtensilsCrossed,
      title: 'On-Site Restaurant',
      description: 'Savor exquisite cuisine at our restaurant, serving a blend of Ghanaian and international dishes prepared by skilled chefs.',
    },
    {
      icon: Dumbbell,
      title: 'Fitness Center',
      description: 'Maintain your workout routine in our well-equipped fitness center with modern cardio and strength equipment.',
    },
  ];

  const roomAmenities = [
    { icon: Wind, title: 'Air Conditioning' },
    { icon: Tv, title: 'Flat Screen TV' },
    { icon: ShowerHead, title: 'Modern Bathroom' },
    { icon: Shield, title: 'In-Room Safe' },
    { icon: Clock, title: '24/7 Room Service' },
    { icon: Sparkles, title: 'Daily Housekeeping' },
  ];

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

      {/* Main Amenities */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <ScrollAnimation>
            <SectionHeader
              subtitle={amenitiesContent.content.featuredSubtitle || 'Featured Amenities'}
              title={amenitiesContent.content.featuredTitle || 'Exceptional Facilities'}
              description={
                amenitiesContent.content.featuredDescription ||
                'We offer a comprehensive range of amenities designed for your comfort and convenience.'
              }
            />
          </ScrollAnimation>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainAmenities.map((amenity) => (
              <StaggerItem key={amenity.title}>
                <div className="group p-8 bg-card rounded-lg card-hover elegant-shadow">
                  <div className="w-14 h-14 mb-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <amenity.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3">{amenity.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{amenity.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pool Feature */}
      <section className="section-padding bg-secondary">
        <div className="hotel-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation direction="left">
              <div className="relative rounded-lg overflow-hidden elegant-shadow">
                <img
                  src={amenitiesContent.images.pool || poolImage}
                  alt="Swimming Pool"
                  className="w-full h-96 object-cover"
                />
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="right" delay={0.2}>
              <div>
                <SectionHeader
                  subtitle="Relaxation"
                  title="Outdoor Swimming Pool"
                  centered={false}
                />
                <p className="text-muted-foreground mb-6">
                  Our beautiful outdoor swimming pool is the perfect place to unwind after a day of exploring or business meetings. Surrounded by lush tropical gardens, the pool area offers a serene escape with comfortable loungers and attentive poolside service.
                </p>
                <ul className="space-y-3">
                  {['Open daily from 7 AM to 9 PM', 'Poolside bar service available', 'Towels provided', 'Sun loungers and umbrellas'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Restaurant Feature */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation direction="left" className="order-2 lg:order-1">
              <div>
                <SectionHeader
                  subtitle="Dining"
                  title="On-Site Restaurant"
                  centered={false}
                />
                <p className="text-muted-foreground mb-6">
                  Experience culinary excellence at our restaurant, where our talented chefs create dishes that celebrate both Ghanaian cuisine and international flavors. From hearty breakfast buffets to elegant dinner service, every meal is a memorable experience.
                </p>
                <ul className="space-y-3">
                  {['Breakfast: 6:30 AM - 10:30 AM', 'Lunch: 12:00 PM - 3:00 PM', 'Dinner: 6:30 PM - 10:30 PM', 'Room service available 24/7'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="right" delay={0.2} className="order-1 lg:order-2">
              <div className="relative rounded-lg overflow-hidden elegant-shadow">
                <img
                  src={amenitiesContent.images.restaurant || restaurantImage}
                  alt="Restaurant"
                  className="w-full h-96 object-cover"
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Room Amenities */}
      <section className="section-padding bg-charcoal text-primary-foreground">
        <div className="hotel-container">
          <ScrollAnimation>
            <SectionHeader
              subtitle="In-Room"
              title="Room Amenities"
              description="Every room comes equipped with modern amenities for your comfort."
              light
            />
          </ScrollAnimation>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {roomAmenities.map((amenity) => (
              <StaggerItem key={amenity.title}>
                <div className="text-center p-6 bg-primary-foreground/5 rounded-lg">
                  <amenity.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-primary-foreground/80">{amenity.title}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Amenities;
