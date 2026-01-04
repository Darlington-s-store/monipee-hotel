import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import SectionHeader from '@/components/SectionHeader';
import ScrollAnimation from '@/components/ScrollAnimation';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';
import { useAuth } from '@/contexts/AuthContext';

import heroImage from '@/assets/hero-hotel.jpg';

const Reviews = () => {
  const { getHeroSection, reviews } = useAuth();
  const hero = getHeroSection('reviews');

  const publishedReviews = reviews.filter((r) => r.status === 'published');

  const ratingBreakdown = [
    { stars: 5, percentage: 65 },
    { stars: 4, percentage: 25 },
    { stars: 3, percentage: 7 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
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

      {/* Rating Summary */}
      <section className="section-padding bg-secondary">
        <div className="hotel-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Overall Rating */}
              <ScrollAnimation direction="left">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-baseline gap-2 mb-4">
                    <span className="text-6xl font-serif font-bold text-primary">4.0</span>
                    <span className="text-2xl text-muted-foreground">/ 5</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < 4 ? 'text-primary fill-primary' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">Based on 212 reviews</p>
                </div>
              </ScrollAnimation>

              {/* Rating Breakdown */}
              <ScrollAnimation direction="right" delay={0.2}>
                <div className="space-y-3">
                  {ratingBreakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="w-8 text-sm text-muted-foreground">{item.stars} ★</span>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm text-muted-foreground text-right">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <ScrollAnimation>
            <SectionHeader
              subtitle="What Guests Say"
              title="Recent Reviews"
            />
          </ScrollAnimation>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedReviews.map((review) => (
              <StaggerItem key={review.id}>
                <ReviewCard name={review.name} date={review.date} rating={review.rating} comment={review.comment} />
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
              Ready to Create Your Own Experience?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join our satisfied guests and book your stay at Monipee Hotel today.
            </p>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <Link to="/booking">
              <Button className="btn-primary px-8">
                Book Your Stay
              </Button>
            </Link>
          </ScrollAnimation>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reviews;
