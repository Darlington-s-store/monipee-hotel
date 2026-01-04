import { useState } from 'react';
import { X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ScrollAnimation from '@/components/ScrollAnimation';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';
import { useAuth } from '@/contexts/AuthContext';

import heroImage from '@/assets/hero-hotel.jpg';

const Gallery = () => {
  const { galleryImages, getHeroSection } = useAuth();
  const hero = getHeroSection('gallery');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Group images by category
  const categories = Object.values(galleryImages.reduce((acc, img) => {
    if (!acc[img.category]) {
      acc[img.category] = {
        name: img.category,
        images: []
      };
    }
    acc[img.category].images.push(img);
    return acc;
  }, {} as Record<string, { name: string; images: typeof galleryImages }>));

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

      {/* Gallery Sections */}
      {categories.map((category, catIndex) => (
        <section key={category.name} className="section-padding bg-background border-b border-border last:border-b-0">
          <div className="hotel-container">
            <ScrollAnimation delay={catIndex * 0.1}>
              <SectionHeader
                subtitle={category.name}
                title={`${category.name} Gallery`}
              />
            </ScrollAnimation>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {category.images.map((image, index) => (
                <StaggerItem key={index}>
                  <div
                    className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group image-zoom"
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                        View
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ))}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 text-primary-foreground hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
