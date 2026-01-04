import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ScrollAnimation from '@/components/ScrollAnimation';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';
import { useAuth } from '@/contexts/AuthContext';

import heroImage from '@/assets/hero-hotel.jpg';

const Location = () => {
  const { getHeroSection } = useAuth();
  const hero = getHeroSection('location');

  const nearbyAttractions = [
    { name: 'Monipee Gold', distance: '0.2 km' },
    { name: 'Ahansowodee Market', distance: '1.5 km' },
    { name: 'Local Bus Station', distance: '2 km' },
    { name: 'City Center', distance: '5 km' },
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

      {/* Map Section */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <ScrollAnimation direction="left">
              <div className="rounded-lg overflow-hidden elegant-shadow h-96 lg:h-auto">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0!2d-1.5!3d6.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzAnMDAuMCJOIDHCsDMwJzAwLjAiVw!5e0!3m2!1sen!2sgh!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Monipee Hotel Location"
                />
              </div>
            </ScrollAnimation>

            {/* Location Info */}
            <ScrollAnimation direction="right" delay={0.2}>
              <div>
                <SectionHeader
                  subtitle="Address"
                  title="How to Find Us"
                  centered={false}
                />

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        Behind Monipee Gold<br />
                        Ahansowodee, Ghana
                      </p>
                      <p className="text-sm text-primary mt-1">Plus Code: 58QX+39 Ahansowodee</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <a href="tel:0322495451" className="text-muted-foreground hover:text-primary transition-colors">
                        032 249 5451
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                      <p className="text-muted-foreground">
                        Check-in: 2:00 PM<br />
                        Check-out: 12:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Monipee+Hotel+Ahansowodee+Ghana"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="btn-primary">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section className="section-padding bg-secondary">
        <div className="hotel-container">
          <ScrollAnimation>
            <SectionHeader
              subtitle="Explore"
              title="Nearby Attractions"
              description="Discover what's around Monipee Hotel"
            />
          </ScrollAnimation>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {nearbyAttractions.map((attraction) => (
              <StaggerItem key={attraction.name}>
                <div className="bg-card p-6 rounded-lg elegant-shadow text-center">
                  <h3 className="font-semibold text-foreground mb-2">{attraction.name}</h3>
                  <p className="text-primary font-medium">{attraction.distance}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Transportation */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <ScrollAnimation>
            <SectionHeader
              subtitle="Getting Here"
              title="Transportation Options"
            />
          </ScrollAnimation>
          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'By Car',
                description: 'Free secure parking available on-site. Easy access from major roads.',
              },
              {
                title: 'By Taxi',
                description: 'Taxi services readily available. Ask driver for "Monipee Hotel, behind Monipee Gold".',
              },
              {
                title: 'Airport Transfer',
                description: 'We can arrange airport pickup service. Contact us in advance to book.',
              },
            ].map((option) => (
              <StaggerItem key={option.title}>
                <div className="text-center p-6 bg-card rounded-lg elegant-shadow">
                  <h3 className="font-serif text-lg font-semibold mb-3">{option.title}</h3>
                  <p className="text-muted-foreground text-sm">{option.description}</p>
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

export default Location;
