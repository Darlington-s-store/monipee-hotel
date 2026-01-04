import { Link } from 'react-router-dom';
import { Award, Users, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ScrollAnimation from '@/components/ScrollAnimation';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';
import { useAuth } from '@/contexts/AuthContext';

import heroImage from '@/assets/hero-hotel.jpg';
import poolImage from '@/assets/pool.jpg';
import restaurantImage from '@/assets/restaurant.jpg';

const About = () => {
  const { getHeroSection, getPageContent } = useAuth();
  const hero = getHeroSection('about');
  const aboutContent = getPageContent('about');

  const values = [
    {
      icon: Heart,
      title: 'Warm Hospitality',
      description: 'We treat every guest like family, ensuring your stay feels like home.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every detail, from service to amenities.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We support and celebrate our local Ghanaian community and culture.',
    },
    {
      icon: Clock,
      title: 'Reliability',
      description: 'Count on us for consistent quality and dependable service, every time.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
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

      {/* Story Section */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation direction="left">
              <div>
                <SectionHeader
                  subtitle={aboutContent.content.storySubtitle || 'Our History'}
                  title={aboutContent.content.storyTitle || 'A Legacy of Excellence'}
                  centered={false}
                />
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    {aboutContent.content.storyP1 || "Founded with a vision to bring world-class hospitality to Ghana, Monipee Hotel has been welcoming guests from around the world for over 15 years. What started as a modest guesthouse has grown into one of the region's most beloved 3-star hotels."}
                  </p>
                  <p>
                    {aboutContent.content.storyP2 || 'Our name, "Monipee," reflects our commitment to excellence and our deep roots in the Ghanaian community. Every aspect of our hotel, from the architecture to the cuisine, celebrates the rich culture and warm hospitality that Ghana is known for.'}
                  </p>
                  <p>
                    {aboutContent.content.storyP3 || 'Today, we continue to uphold the values that have made us successful: exceptional service, attention to detail, and a genuine care for every guest who walks through our doors.'}
                  </p>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={aboutContent.images.pool || poolImage}
                  alt="Pool area"
                  className="w-full h-64 object-cover rounded-lg elegant-shadow"
                />
                <img
                  src={aboutContent.images.restaurant || restaurantImage}
                  alt="Restaurant"
                  className="w-full h-64 object-cover rounded-lg elegant-shadow mt-8"
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary">
        <div className="hotel-container">
          <ScrollAnimation>
            <SectionHeader
              subtitle="Our Values"
              title="What We Stand For"
              description="The principles that guide everything we do at Monipee Hotel."
            />
          </ScrollAnimation>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-charcoal text-primary-foreground">
        <div className="hotel-container">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '15+', label: 'Years of Service' },
              { number: '50+', label: 'Comfortable Rooms' },
              { number: '10K+', label: 'Happy Guests' },
              { number: '4.0', label: 'Average Rating' },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div>
                  <span className="block text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                    {stat.number}
                  </span>
                  <span className="text-primary-foreground/70">{stat.label}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <ScrollAnimation>
            <SectionHeader
              subtitle="Our Team"
              title="Meet the People Behind Your Experience"
              description="Our dedicated team is committed to making your stay exceptional."
            />
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8">
              From our front desk staff to our housekeeping team, every member of the Monipee family is trained to provide warm, personalized service. We believe that it's our people who make the difference, turning a good stay into an unforgettable experience.
            </p>
          </ScrollAnimation>
          <ScrollAnimation delay={0.3}>
            <div className="text-center">
              <Link to="/contact">
                <Button className="btn-primary px-8">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
