import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ScrollAnimation from '@/components/ScrollAnimation';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';
import { useAuth } from '@/contexts/AuthContext';

import heroImage from '@/assets/hero-hotel.jpg';

const Contact = () => {
  const { getHeroSection } = useAuth();
  const hero = getHeroSection('contact');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you shortly.",
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      {/* Contact Section */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollAnimation direction="left">
              <div>
                <SectionHeader
                  subtitle="Send a Message"
                  title="Get in Touch"
                  centered={false}
                />
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Your Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="bg-card"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="bg-card"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+233 XX XXX XXXX"
                        className="bg-card"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject *
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Reservation Inquiry"
                        required
                        className="bg-card"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={5}
                      required
                      className="bg-card"
                    />
                  </div>
                  <Button type="submit" className="btn-primary px-8">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </ScrollAnimation>

            {/* Contact Info */}
            <ScrollAnimation direction="right" delay={0.2}>
              <div>
                <SectionHeader
                  subtitle="Contact Information"
                  title="Reach Out to Us"
                  centered={false}
                />

                <StaggerContainer className="space-y-6 mb-8">
                  <StaggerItem>
                    <div className="flex items-start gap-4 p-4 bg-card rounded-lg elegant-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Address</h3>
                        <p className="text-muted-foreground">
                          Behind Monipee Gold<br />
                          Ahansowodee, Ghana
                        </p>
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="flex items-start gap-4 p-4 bg-card rounded-lg elegant-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                        <a href="tel:0322495451" className="text-muted-foreground hover:text-primary transition-colors">
                          032 249 5451
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">Available 24/7</p>
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="flex items-start gap-4 p-4 bg-card rounded-lg elegant-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <a href="mailto:info@monipeehotel.com" className="text-muted-foreground hover:text-primary transition-colors">
                          info@monipeehotel.com
                        </a>
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="flex items-start gap-4 p-4 bg-card rounded-lg elegant-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Reception Hours</h3>
                        <p className="text-muted-foreground">24 hours, 7 days a week</p>
                      </div>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/2330322495451"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full p-4 bg-[#25D366] text-primary-foreground rounded-lg font-semibold hover:bg-[#128C7E] transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                  Chat on WhatsApp
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Map */}
      <ScrollAnimation>
        <section className="h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0!2d-1.5!3d6.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzAnMDAuMCJOIDHCsDMwJzAwLjAiVw!5e0!3m2!1sen!2sgh!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Monipee Hotel Location"
          />
        </section>
      </ScrollAnimation>

      <Footer />
    </div>
  );
};

export default Contact;
