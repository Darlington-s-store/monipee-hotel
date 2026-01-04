import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { format, differenceInDays, addDays } from 'date-fns';
import { Calendar, Users, CreditCard, User, Mail, Phone, MessageSquare, Check, ArrowLeft, ArrowRight, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { validatePromoCode, PromoCode } from '@/lib/promoCodes';
import { sendBookingConfirmation, generateBookingReference } from '@/lib/emailService';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollAnimation from '@/components/ScrollAnimation';

import roomStandard from '@/assets/room-standard.jpg';
import roomDeluxe from '@/assets/room-deluxe.jpg';
import roomSuite from '@/assets/room-suite.jpg';
import heroImage from '@/assets/pool.jpg';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, addBooking, rooms, getHeroSection } = useAuth();
  const hero = getHeroSection('booking');
  const navigate = useNavigate();
  
  const PENDING_BOOKING_KEY = 'monipee_pending_booking';

  // Get room from URL or default to first room
  const roomIdFromUrl = searchParams.get('room') || 'standard';
  const checkInFromUrl = searchParams.get('checkIn');
  const checkOutFromUrl = searchParams.get('checkOut');
  const guestsFromUrl = searchParams.get('guests');
  const roomCountFromUrl = searchParams.get('roomCount');

  // Form state
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(roomIdFromUrl);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    checkInFromUrl ? new Date(checkInFromUrl) : addDays(new Date(), 1)
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    checkOutFromUrl ? new Date(checkOutFromUrl) : addDays(new Date(), 3)
  );
  const [guests, setGuests] = useState(guestsFromUrl || '2');
  const [roomCount, setRoomCount] = useState(roomCountFromUrl || '1');

  // Guest details
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  // Restore pending booking state or pre-fill from user
  useEffect(() => {
    const savedBooking = localStorage.getItem(PENDING_BOOKING_KEY);
    if (savedBooking) {
      const parsed = JSON.parse(savedBooking);
      // Only restore if less than 1 hour old to avoid stale data
      if (new Date().getTime() - parsed.timestamp < 3600000) {
        setGuestDetails(parsed.guestDetails);
        setStep(parsed.step);
        // Also restore other fields if they are not in URL (URL takes precedence)
        if (!roomIdFromUrl) setSelectedRoom(parsed.selectedRoom);
        if (!guestsFromUrl) setGuests(parsed.guests);
        if (!roomCountFromUrl) setRoomCount(parsed.roomCount);
      }
      // Clear it after restoring so it doesn't persist forever
      localStorage.removeItem(PENDING_BOOKING_KEY);
    } else if (user && !guestDetails.email) {
      // Pre-fill from user profile
      const [first, ...last] = user.name.split(' ');
      setGuestDetails(prev => ({
        ...prev,
        firstName: first || '',
        lastName: last.join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user, roomIdFromUrl, guestsFromUrl, roomCountFromUrl]);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ promo: PromoCode; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  const selectedRoomData = rooms.find(r => r.id === selectedRoom) || rooms[0];

  if (!selectedRoomData) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const subtotal = selectedRoomData.price * nights * parseInt(roomCount);
  const discount = appliedPromo?.discount || 0;
  const total = subtotal - discount;

  const handleGuestDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGuestDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code.');
      return;
    }

    const result = validatePromoCode(
      promoCode,
      checkIn,
      checkOut,
      nights,
      selectedRoomData.price,
      parseInt(roomCount)
    );

    if (result.valid && result.promo && result.discountAmount) {
      setAppliedPromo({ promo: result.promo, discount: result.discountAmount });
      setPromoError('');
      toast({
        title: "Promo Code Applied!",
        description: `${result.promo.name} - You save GH₵${result.discountAmount.toFixed(2)}`,
      });
    } else {
      setPromoError(result.errorMessage || 'Invalid promo code.');
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const handleSubmit = async () => {
    const storedUser = localStorage.getItem('monipee_current_user');
    if (!user && !storedUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your booking.",
      });

      // Save current state to localStorage
      localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify({
        guestDetails,
        step: 3, // Return to payment step
        selectedRoom,
        guests,
        roomCount,
        timestamp: new Date().getTime(),
      }));

      const params = new URLSearchParams();
      params.set('redirect', '/booking');
      params.set('room', selectedRoom);
      if (checkIn) params.set('checkIn', format(checkIn, 'yyyy-MM-dd'));
      if (checkOut) params.set('checkOut', format(checkOut, 'yyyy-MM-dd'));
      params.set('guests', guests);
      params.set('roomCount', roomCount);
      navigate(`/auth?${params.toString()}`);
      return;
    }

    const reference = generateBookingReference();
    setBookingReference(reference);

    // Send confirmation email
    const emailResult = await sendBookingConfirmation({
      guestName: `${guestDetails.firstName} ${guestDetails.lastName}`,
      guestEmail: guestDetails.email,
      guestPhone: guestDetails.phone,
      roomName: selectedRoomData.name,
      checkIn: checkIn ? format(checkIn, 'PPP') : '',
      checkOut: checkOut ? format(checkOut, 'PPP') : '',
      nights,
      guests,
      roomCount,
      subtotal: `GH₵${subtotal.toFixed(2)}`,
      discount: appliedPromo ? `GH₵${discount.toFixed(2)} (${appliedPromo.promo.code})` : 'None',
      total: `GH₵${total.toFixed(2)}`,
      bookingReference: reference,
      specialRequests: guestDetails.specialRequests,
    });

    const parsedStoredUser: { id: string } | null = storedUser ? JSON.parse(storedUser) : null;
    const bookingPayload = {
      userId: user?.id || parsedStoredUser?.id || 'guest',
      roomType: selectedRoom,
      roomName: selectedRoomData.name,
      checkIn: checkIn ? new Date(checkIn).toISOString() : new Date().toISOString(),
      checkOut: checkOut ? new Date(checkOut).toISOString() : new Date().toISOString(),
      guests: parseInt(guests),
      totalPrice: total,
      status: 'pending' as const,
      guestDetails: {
        firstName: guestDetails.firstName,
        lastName: guestDetails.lastName,
        email: guestDetails.email,
        phone: guestDetails.phone,
        specialRequests: guestDetails.specialRequests,
      },
    };
    addBooking(bookingPayload);

    if (emailResult.success) {
      toast({
        title: "Booking Request Submitted!",
        description: "We'll send a confirmation email shortly. Thank you for choosing Monipee Hotel!",
      });
    } else {
      toast({
        title: "Booking Request Submitted!",
        description: "Your booking is confirmed. Please check your email or contact us for confirmation.",
      });
    }
    
    setStep(4);
  };

  const isStep1Valid = checkIn && checkOut && nights > 0;
  const isStep2Valid = guestDetails.firstName && guestDetails.lastName && guestDetails.email && guestDetails.phone;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.backgroundImage || heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 hotel-container text-center text-white pt-20">
          <ScrollAnimation>
            <span className="inline-block text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
              {hero.label}
            </span>
          </ScrollAnimation>
          <ScrollAnimation delay={0.1}>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg whitespace-pre-line">
              {hero.title}
            </h1>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md font-medium">
              {hero.subtitle}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-6 bg-secondary border-b border-border">
        <div className="hotel-container">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {[
              { num: 1, label: 'Select Room' },
              { num: 2, label: 'Guest Details' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Confirmation' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center gap-2 ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > s.num ? 'bg-primary text-primary-foreground' :
                    step === s.num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="hidden md:inline font-medium">{s.label}</span>
                </div>
                {i < 3 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-2 ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding bg-background">
        <div className="hotel-container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Room Selection */}
              {step === 1 && (
                <ScrollAnimation>
                  <div className="bg-card rounded-xl p-6 md:p-8 elegant-shadow">
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                      1. Select Your Room & Dates
                    </h2>

                    {/* Date Selection */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Check-in Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !checkIn && 'text-muted-foreground'
                              )}
                            >
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
                        <Label className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Check-out Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !checkOut && 'text-muted-foreground'
                              )}
                            >
                              {checkOut ? format(checkOut, 'PPP') : 'Select date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={checkOut}
                              onSelect={setCheckOut}
                              disabled={(date) => date <= (checkIn || new Date())}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          Guests
                        </Label>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        >
                          {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Number of Rooms</Label>
                        <select
                          value={roomCount}
                          onChange={(e) => setRoomCount(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        >
                          {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Room Selection */}
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                      Choose Your Room Type
                    </h3>
                    <div className="space-y-4">
                      {rooms.map(room => (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoom(room.id)}
                          className={`flex flex-col md:flex-row gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedRoom === room.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full md:w-32 h-24 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-foreground">{room.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {room.size || 'N/A'} • Up to {room.capacity} guests
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-bold text-primary">GH₵{room.price}</span>
                                <span className="text-sm text-muted-foreground">/night</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {room.amenities.slice(0, 4).map(amenity => (
                                <span key={amenity} className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              selectedRoom === room.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                            } flex items-center justify-center`}>
                              {selectedRoom === room.id && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end mt-8">
                      <Button
                        className="btn-primary px-8"
                        onClick={() => setStep(2)}
                        disabled={!isStep1Valid}
                      >
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollAnimation>
              )}

              {/* Step 2: Guest Details */}
              {step === 2 && (
                <ScrollAnimation>
                  <div className="bg-card rounded-xl p-6 md:p-8 elegant-shadow">
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                      2. Guest Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={guestDetails.firstName}
                          onChange={handleGuestDetailsChange}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={guestDetails.lastName}
                          onChange={handleGuestDetailsChange}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={guestDetails.email}
                          onChange={handleGuestDetailsChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={guestDetails.phone}
                          onChange={handleGuestDetailsChange}
                          placeholder="+233 XX XXX XXXX"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <Label htmlFor="specialRequests" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={guestDetails.specialRequests}
                        onChange={handleGuestDetailsChange}
                        placeholder="Any special requests or requirements..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                      </Button>
                      <Button
                        className="btn-primary px-8"
                        onClick={() => setStep(3)}
                        disabled={!isStep2Valid}
                      >
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollAnimation>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <ScrollAnimation>
                  <div className="bg-card rounded-xl p-6 md:p-8 elegant-shadow">
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                      3. Payment Method
                    </h2>

                    <div className="space-y-4 mb-6">
                      {[
                        { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, etc.' },
                        { id: 'momo', label: 'Mobile Money', icon: Phone, desc: 'MTN, Vodafone, AirtelTigo' },
                        { id: 'cash', label: 'Pay at Hotel', icon: CreditCard, desc: 'Pay upon arrival' },
                      ].map(method => (
                        <div
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                            <method.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{method.label}</h4>
                            <p className="text-sm text-muted-foreground">{method.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            paymentMethod === method.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                          } flex items-center justify-center`}>
                            {paymentMethod === method.id && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> For credit/debit card and mobile money payments, you will receive a secure payment link via email to complete your booking. For "Pay at Hotel", a deposit may be required to confirm your reservation.
                      </p>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                      </Button>
                      <Button className="btn-primary px-8" onClick={handleSubmit}>
                        Complete Booking
                        <Check className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollAnimation>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <ScrollAnimation>
                  <div className="bg-card rounded-xl p-6 md:p-8 elegant-shadow text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                      Booking Confirmed!
                    </h2>
                    <div className="bg-primary/10 text-primary font-mono font-bold py-2 px-4 rounded-lg mb-4 inline-block">
                      Reference: {bookingReference}
                    </div>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Thank you for choosing Monipee Hotel! A confirmation email has been sent to <strong>{guestDetails.email}</strong> with your booking details.
                    </p>
                    <div className="bg-secondary rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
                      <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Room:</strong> {selectedRoomData.name}</p>
                        <p><strong>Check-in:</strong> {checkIn && format(checkIn, 'PPP')} (from 2:00 PM)</p>
                        <p><strong>Check-out:</strong> {checkOut && format(checkOut, 'PPP')} (by 12:00 PM)</p>
                        <p><strong>Guests:</strong> {guests}</p>
                        {appliedPromo && (
                          <p><strong>Promo:</strong> <span className="text-green-600">{appliedPromo.promo.code} (-GH₵{discount.toFixed(2)})</span></p>
                        )}
                        <p><strong>Total:</strong> GH₵{total.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link to="/">
                        <Button variant="outline">
                          Return to Home
                        </Button>
                      </Link>
                      <a href="tel:0322495451">
                        <Button className="btn-primary">
                          Call Us: 032 249 5451
                        </Button>
                      </a>
                    </div>
                  </div>
                </ScrollAnimation>
              )}
            </div>

            {/* Booking Summary Sidebar */}
            {step < 4 && (
              <div className="lg:col-span-1">
                <ScrollAnimation delay={0.2}>
                  <div className="bg-card rounded-xl p-6 elegant-shadow sticky top-24">
                    <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                      Booking Summary
                    </h3>
                    
                    <div className="mb-4">
                      <img
                        src={selectedRoomData.image}
                        alt={selectedRoomData.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-foreground">{selectedRoomData.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedRoomData.size}</p>
                    </div>

                    <div className="space-y-3 border-t border-border pt-4 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Check-in</span>
                        <span className="font-medium">{checkIn ? format(checkIn, 'MMM dd, yyyy') : '-'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Check-out</span>
                        <span className="font-medium">{checkOut ? format(checkOut, 'MMM dd, yyyy') : '-'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nights</span>
                        <span className="font-medium">{nights}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rooms</span>
                        <span className="font-medium">{roomCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Guests</span>
                        <span className="font-medium">{guests}</span>
                      </div>
                    </div>

                    {/* Promo Code Section */}
                    <div className="border-t border-border pt-4 mb-4">
                      <Label className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-primary" />
                        Promo Code
                      </Label>
                      {appliedPromo ? (
                        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                          <div>
                            <span className="font-mono font-bold text-green-700 dark:text-green-400">{appliedPromo.promo.code}</span>
                            <p className="text-xs text-green-600 dark:text-green-500">{appliedPromo.promo.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRemovePromo}
                            className="text-green-700 hover:text-red-600 h-8 w-8"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            className="flex-1 font-mono"
                          />
                          <Button
                            variant="outline"
                            onClick={handleApplyPromo}
                            disabled={!promoCode.trim()}
                          >
                            Apply
                          </Button>
                        </div>
                      )}
                      {promoError && (
                        <p className="text-xs text-destructive mt-1">{promoError}</p>
                      )}
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          GH₵{selectedRoomData.price} x {nights} night{nights > 1 ? 's' : ''} x {roomCount} room{parseInt(roomCount) > 1 ? 's' : ''}
                        </span>
                        <span>GH₵{subtotal.toFixed(2)}</span>
                      </div>
                      {appliedPromo && (
                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                          <span>Discount ({appliedPromo.promo.code})</span>
                          <span>-GH₵{discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-primary">GH₵{total.toFixed(2)}</span>
                      </div>
                      {appliedPromo && (
                        <p className="text-xs text-green-600 dark:text-green-400 text-right">
                          You save GH₵{discount.toFixed(2)}!
                        </p>
                      )}
                    </div>

                    <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 font-medium">
                        ✓ Free cancellation up to 48 hours before check-in
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
