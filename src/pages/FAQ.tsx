import { HelpCircle, Clock, CreditCard, Utensils, Wifi, Car, Baby, PawPrint, Accessibility } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ScrollAnimation from '@/components/ScrollAnimation';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';

const faqCategories = [
  {
    title: 'Check-in & Check-out',
    icon: Clock,
    questions: [
      {
        question: 'What are the check-in and check-out times?',
        answer: 'Check-in time is from 2:00 PM onwards. Check-out time is 12:00 PM (noon). Early check-in and late check-out may be available upon request, subject to availability and additional charges.',
      },
      {
        question: 'Can I request an early check-in or late check-out?',
        answer: 'Yes, early check-in and late check-out requests can be made at the time of booking or by contacting our front desk. These requests are subject to availability and may incur an additional fee of GH₵100 per request.',
      },
      {
        question: 'What documents do I need for check-in?',
        answer: 'All guests must present a valid government-issued photo ID (passport, national ID, or driver\'s license) at check-in. For international guests, a valid passport is required.',
      },
      {
        question: 'Can someone else check in on my behalf?',
        answer: 'For security purposes, the person whose name is on the reservation must be present at check-in. If you need someone else to check in, please contact us in advance to make arrangements.',
      },
    ],
  },
  {
    title: 'Reservations & Cancellation',
    icon: CreditCard,
    questions: [
      {
        question: 'What is your cancellation policy?',
        answer: 'Free cancellation is available up to 48 hours before your scheduled check-in date. Cancellations made within 48 hours of check-in will be charged one night\'s stay. No-shows will be charged the full reservation amount.',
      },
      {
        question: 'How can I modify my reservation?',
        answer: 'You can modify your reservation by calling us at 032 249 5451 or sending an email to reservations@monipeehotel.com. Modifications are subject to availability and rate changes may apply.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept cash (Ghana Cedis), Visa, Mastercard, Mobile Money (MTN, Vodafone, AirtelTigo), and bank transfers. A valid credit card is required at check-in for incidentals.',
      },
      {
        question: 'Is a deposit required?',
        answer: 'A deposit equivalent to one night\'s stay is required at the time of booking to confirm your reservation. The remaining balance is due at check-in.',
      },
      {
        question: 'Do you offer refunds?',
        answer: 'Refunds are processed according to our cancellation policy. Eligible refunds are typically processed within 5-7 business days to the original payment method.',
      },
    ],
  },
  {
    title: 'Dining & Breakfast',
    icon: Utensils,
    questions: [
      {
        question: 'Is breakfast included in the room rate?',
        answer: 'Yes! All room rates include complimentary breakfast buffet served daily from 6:30 AM to 10:30 AM in our restaurant. We offer both continental and local Ghanaian breakfast options.',
      },
      {
        question: 'Do you have a restaurant on-site?',
        answer: 'Yes, our on-site restaurant serves breakfast, lunch, and dinner. We offer a diverse menu featuring Ghanaian cuisine, continental dishes, and international favorites. Room service is also available.',
      },
      {
        question: 'Can you accommodate dietary restrictions?',
        answer: 'Absolutely! Please inform us of any dietary restrictions or allergies when making your reservation or upon check-in. Our kitchen can accommodate vegetarian, vegan, halal, and gluten-free requirements.',
      },
      {
        question: 'What are the restaurant hours?',
        answer: 'Our restaurant operates: Breakfast 6:30 AM - 10:30 AM, Lunch 12:00 PM - 3:00 PM, Dinner 6:00 PM - 10:00 PM. The poolside bar is open from 10:00 AM to 10:00 PM.',
      },
    ],
  },
  {
    title: 'Amenities & Services',
    icon: Wifi,
    questions: [
      {
        question: 'Is Wi-Fi available?',
        answer: 'Yes, complimentary high-speed Wi-Fi is available throughout the hotel, including all guest rooms, public areas, and the pool area. Connect using the network "Monipee-Guest" and enter your room number.',
      },
      {
        question: 'What are the pool hours?',
        answer: 'Our outdoor swimming pool is open daily from 7:00 AM to 9:00 PM. Towels are provided poolside. Please note that children under 12 must be accompanied by an adult.',
      },
      {
        question: 'Do you have a fitness center?',
        answer: 'Yes, our fitness center is open 24/7 for hotel guests. It features cardio equipment, free weights, and exercise machines. Complimentary towels and water are provided.',
      },
      {
        question: 'Is laundry service available?',
        answer: 'Yes, we offer same-day laundry and dry cleaning services. Items dropped off before 9:00 AM will be returned by 6:00 PM. Express service is available for an additional fee.',
      },
      {
        question: 'Do you offer airport transfers?',
        answer: 'Yes, we can arrange airport transfers for an additional fee. Please contact our front desk at least 24 hours in advance to arrange pickup from Kotoka International Airport or other locations.',
      },
    ],
  },
  {
    title: 'Parking & Transportation',
    icon: Car,
    questions: [
      {
        question: 'Is parking available?',
        answer: 'Yes, we offer complimentary secure parking for all hotel guests. Our parking lot is monitored 24/7 with CCTV and security personnel.',
      },
      {
        question: 'Do you offer car rental services?',
        answer: 'We can arrange car rental services through our trusted local partners. Please contact the front desk for rates and availability.',
      },
      {
        question: 'How far is the hotel from the airport?',
        answer: 'Monipee Hotel is approximately 45 minutes from Kotoka International Airport in Accra, depending on traffic conditions. We recommend using our airport transfer service for convenience.',
      },
    ],
  },
  {
    title: 'Family & Accessibility',
    icon: Baby,
    questions: [
      {
        question: 'Are children allowed?',
        answer: 'Absolutely! Children of all ages are welcome. Children under 6 stay free when using existing bedding. Cribs and extra beds are available upon request for an additional fee.',
      },
      {
        question: 'Do you have family rooms?',
        answer: 'Yes, our Executive Suites are ideal for families and can accommodate up to 4 guests comfortably. We also offer connecting rooms upon request.',
      },
      {
        question: 'Are pets allowed?',
        answer: 'Unfortunately, we do not allow pets in the hotel, with the exception of certified service animals. Please contact us in advance if you will be traveling with a service animal.',
      },
      {
        question: 'Is the hotel wheelchair accessible?',
        answer: 'Yes, Monipee Hotel is wheelchair accessible. We have accessible rooms available, ramp access at the entrance, an elevator, and accessible facilities throughout the property.',
      },
    ],
  },
];

const FAQ = () => {
  const { getHeroSection } = useAuth();
  const hero = getHeroSection('faq');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-charcoal">
        <div className="hotel-container text-center">
          <ScrollAnimation>
            <span className="inline-block text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
              {hero.label}
            </span>
          </ScrollAnimation>
          <ScrollAnimation delay={0.1}>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
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

      {/* Quick Contact */}
      <section className="py-8 bg-primary">
        <div className="hotel-container">
          <ScrollAnimation>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-primary-foreground text-center">
              <HelpCircle className="w-6 h-6" />
              <span className="font-medium">Can't find your answer? Call us at</span>
              <a href="tel:0322495451" className="font-bold underline hover:no-underline">
                032 249 5451
              </a>
              <span>or email</span>
              <a href="mailto:info@monipeehotel.com" className="font-bold underline hover:no-underline">
                info@monipeehotel.com
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section-padding bg-background">
        <div className="hotel-container max-w-4xl">
          <StaggerContainer className="space-y-12">
            {faqCategories.map((category) => (
              <StaggerItem key={category.title}>
                <div className="bg-card rounded-xl p-6 md:p-8 elegant-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                      {category.title}
                    </h2>
                  </div>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.title}-${index}`}
                        className="border border-border rounded-lg px-4 data-[state=open]:bg-secondary/50"
                      >
                        <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="section-padding bg-secondary">
        <div className="hotel-container text-center">
          <ScrollAnimation>
            <SectionHeader
              subtitle="Need More Help?"
              title="We're Here For You"
              description="Our friendly team is available 24/7 to answer any questions and assist with your reservation."
            />
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <a href="tel:0322495451" className="btn-primary px-8 py-4 rounded-md font-semibold">
                Call Us Now
              </a>
              <a
                href="https://wa.me/233322495451"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold px-8 py-4 rounded-md font-semibold"
              >
                Chat on WhatsApp
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
