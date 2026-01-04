import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Booking,
  Room,
  Message,
  GalleryImage,
  Review,
  RoomReview,
  HeroSection,
  PageContent,
  HotelSettings
} from '@/types/auth';





interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  // Booking functions
  getBookings: () => Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  getAllBookings: () => Booking[];
  // Message functions
  getMessages: () => Message[];
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'status'>) => Message;
  getAllMessages: () => Message[];
  updateMessage: (id: string, data: Partial<Message>) => void;
  // User functions (admin)
  getAllUsers: () => User[];
  // Room functions
  rooms: Room[];
  getRooms: () => Room[];
  addRoom: (room: Room) => void;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  // Gallery functions
  galleryImages: GalleryImage[];
  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => void;
  deleteGalleryImage: (id: string) => void;

  // Reviews functions
  reviews: Review[];
  addReview: (review: Omit<Review, 'id'>) => void;
  updateReview: (id: string, data: Partial<Omit<Review, 'id'>>) => void;
  deleteReview: (id: string) => void;

  // Room review functions
  getRoomReviews: (roomId: string) => RoomReview[];
  addRoomReview: (roomId: string, data: { rating: number; comment: string }) => { success: boolean; error?: string };
  getAllRoomReviews: () => RoomReview[];
  updateRoomReviewStatus: (reviewId: string, status: RoomReview['status']) => void;

  // Hero section functions
  heroSections: HeroSection[];
  getHeroSection: (id: string) => HeroSection;
  updateHeroSection: (id: string, data: Partial<Omit<HeroSection, 'id'>>) => void;

  // Page content functions
  pageContents: PageContent[];
  getPageContent: (id: string) => PageContent;
  updatePageContent: (id: string, data: Partial<Omit<PageContent, 'id'>>) => void;

  // Settings
  settings: HotelSettings;
  updateSettings: (data: Partial<HotelSettings>) => void;

  // Password Reset
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (password: string, token: string, email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'monipee_users';
const CURRENT_USER_KEY = 'monipee_current_user';
const BOOKINGS_KEY = 'monipee_bookings';
const MESSAGES_KEY = 'monipee_messages';
const ROOMS_KEY = 'monipee_rooms';
const GALLERY_KEY = 'monipee_gallery';
const REVIEWS_KEY = 'monipee_reviews';
const ROOM_REVIEWS_KEY = 'monipee_room_reviews';
const HERO_KEY = 'monipee_hero_sections';
const PAGE_CONTENT_KEY = 'monipee_page_contents';
const SETTINGS_KEY = 'monipee_settings';

const DEFAULT_SETTINGS: HotelSettings = {
  hotelName: 'Monipee Hotel',
  email: 'info@monipeehotel.com',
  phone: '032 249 5451',
  address: 'Ahansowodee, Ghana (Behind Monipee Gold)',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  currency: 'GH₵',
  taxRate: 15,
  enableBookings: true,
  enableReviews: true,
  maintenanceMode: false,
};

const DEFAULT_PAGE_CONTENTS: PageContent[] = [
  {
    id: 'home',
    images: {
      aboutPreview: '',
    },
    content: {
      heroRating: '4.0',
      heroReviewCount: '212',
      heroStartingPrice: '331',
      aboutPreviewSubtitle: 'Welcome',
      aboutPreviewTitle: 'A Haven of Comfort in Ghana',
      aboutPreviewDescription:
        'Nestled in the heart of Ahansowodee, Monipee Hotel offers a perfect blend of traditional Ghanaian hospitality and modern luxury.',
      aboutPreviewBody:
        "Whether you're traveling for business or leisure, our dedicated team ensures every moment of your stay is memorable. From our elegantly appointed rooms to our world-class amenities, experience hospitality that exceeds expectations.",
      amenitiesPreviewSubtitle: 'Amenities',
      amenitiesPreviewTitle: 'Exceptional Facilities',
      amenitiesPreviewDescription:
        'Enjoy our comprehensive range of amenities designed for your comfort and convenience.',
      amenitiesCardWifiTitle: 'Free Wi-Fi',
      amenitiesCardWifiDescription: 'High-speed internet throughout the hotel',
      amenitiesCardBreakfastTitle: 'Free Breakfast',
      amenitiesCardBreakfastDescription: 'Complimentary daily breakfast buffet',
      amenitiesCardParkingTitle: 'Free Parking',
      amenitiesCardParkingDescription: 'Secure on-site parking for all guests',
      amenitiesCardPoolTitle: 'Swimming Pool',
      amenitiesCardPoolDescription: 'Outdoor pool with poolside service',
      galleryPreviewSubtitle: 'Gallery',
      galleryPreviewTitle: 'A Glimpse of Monipee',
      galleryPreviewDescription: 'Explore highlights from our rooms, amenities, dining, and exterior.',
    },
  },
  {
    id: 'about',
    images: {
      hero: '',
      pool: '',
      restaurant: '',
    },
    content: {
      storySubtitle: 'Our History',
      storyTitle: 'A Legacy of Excellence',
      storyP1:
        'Founded with a vision to bring world-class hospitality to Ghana, Monipee Hotel has been welcoming guests from around the world for over 15 years. What started as a modest guesthouse has grown into one of the region\'s most beloved 3-star hotels.',
      storyP2:
        'Our name, "Monipee," reflects our commitment to excellence and our deep roots in the Ghanaian community. Every aspect of our hotel, from the architecture to the cuisine, celebrates the rich culture and warm hospitality that Ghana is known for.',
      storyP3:
        'Today, we continue to uphold the values that have made us successful: exceptional service, attention to detail, and a genuine care for every guest who walks through our doors.',
    },
  },
  {
    id: 'amenities',
    images: {
      hero: '',
      pool: '',
      restaurant: '',
    },
    content: {
      featuredSubtitle: 'Featured Amenities',
      featuredTitle: 'Exceptional Facilities',
      featuredDescription:
        'We offer a comprehensive range of amenities designed for your comfort and convenience.',
    },
  },
  {
    id: 'gallery',
    images: {
      hero: '',
    },
    content: {},
  },
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'review-matilda-tsagli',
    name: 'Matilda Tsagli',
    date: 'December 2024',
    rating: 4,
    comment:
      'The roads leading to Monipee has deteriorated. It’s dusty and have potholes. If it’s fixed, Monipee will be a hit. Some of the locks on the door need replaced and the door leading to our room also needs maintained.',
    status: 'published',
  },
  {
    id: 'review-richard-bellson',
    name: 'Richard Bellson',
    date: '2 years ago',
    rating: 5,
    comment:
      'Monipee Hotel stands out as one of the best accommodations in Obuasi. The serene environment creates a pleasant atmosphere for guests, while the security measures provide peace of mind.',
    status: 'published',
  },
  {
    id: 'review-gideon-ofori',
    name: 'Gideon Ofori',
    date: '2 years ago',
    rating: 4,
    comment:
      "Great place... a little far out from the Obuasi township. Good thing is there's a police post at their entrance at night. So good security.",
    status: 'published',
  },
  {
    id: 'review-abena-kesewaa',
    name: 'Abena Kesewaa',
    date: '7 years ago',
    rating: 5,
    comment:
      'Serene environment, clean rooms, and well kept washrooms. Highly professional staff. My all time favorite hotel in Obuasi right now.',
    status: 'published',
  },
  {
    id: 'review-emmanuel-nyarko',
    name: 'Emmanuel Nyarko',
    date: '2 years ago',
    rating: 4,
    comment: "Good environment to enjoy your holidays and they've a nice swimming pool to also enjoy yourself.",
    status: 'published',
  },
  {
    id: 'review-charles-akyeampong',
    name: 'Charles Akyeampong',
    date: 'a year ago',
    rating: 1,
    comment:
      'Outwards looks good with flowers and beautiful plants garden. Reception staff ok, the area is not serene. The rooms are not well kept. Water dampness is an issue on the walls and makes the rooms stuffy. Washroom maintenance and tidiness is an issue.',
    status: 'published',
  },
  {
    id: 'review-alycea-shirley',
    name: 'Alycea Shirley',
    date: '3 years ago',
    rating: 1,
    comment:
      'This had to be my worst experience at a hotel in Ghana. The place is very beautiful when you enter, but looks are definitely deceiving. There is a serious water issue; the water comes out yellow a lot of the time.',
    status: 'published',
  },
  {
    id: 'review-see-the-world',
    name: 'See the World',
    date: '5 years ago',
    rating: 3,
    comment:
      'Sad to give this hotel 3 stars but I have to. The landscape is immaculate; receptionist, caterers, and cleaners are amazing; food is awesome. But there are maintenance issues.',
    status: 'published',
  },
  {
    id: 'review-sylvester-mawuli-abudu',
    name: 'Sylvester Mawuli Abudu',
    date: '6 years ago',
    rating: 5,
    comment: 'Monipee is a great place and a very beautiful environment. I love to hang out there. Good reception and great service.',
    status: 'published',
  },
];

const DEFAULT_HERO_SECTIONS: HeroSection[] = [
  {
    id: 'home',
    backgroundImage: '',
    label: '★★★ 3-Star Luxury Hotel',
    title: 'Welcome to\nMonipee Hotel',
    subtitle: 'Experience Ghanaian hospitality at its finest. Your comfort is our priority.',
  },
  {
    id: 'about',
    backgroundImage: '',
    label: 'Our Story',
    title: 'About Monipee Hotel',
    subtitle: "Discover the story behind Ghana's premier hospitality destination",
  },
  {
    id: 'rooms',
    backgroundImage: '',
    label: 'Accommodations',
    title: 'Rooms & Suites',
    subtitle: 'Find your perfect room for an unforgettable stay',
  },
  {
    id: 'amenities',
    backgroundImage: '',
    label: 'Facilities',
    title: 'Hotel Amenities',
    subtitle: 'Everything you need for a comfortable and memorable stay',
  },
  {
    id: 'gallery',
    backgroundImage: '',
    label: 'Visual Tour',
    title: 'Photo Gallery',
    subtitle: 'Take a visual journey through Monipee Hotel',
  },
  {
    id: 'reviews',
    backgroundImage: '',
    label: 'Testimonials',
    title: 'Guest Reviews',
    subtitle: 'See what our guests have to say about their experience',
  },
  {
    id: 'location',
    backgroundImage: '',
    label: 'Find Us',
    title: 'Location & Directions',
    subtitle: 'Conveniently located in the heart of Ahansowodee, Ghana',
  },
  {
    id: 'contact',
    backgroundImage: '',
    label: 'Get in Touch',
    title: 'Contact Us',
    subtitle: "We're here to help with any questions or reservations",
  },
  {
    id: 'booking',
    backgroundImage: '',
    label: 'Reservations',
    title: 'Book Your Stay',
    subtitle: 'Complete your reservation in just a few steps and experience luxury.',
  },
  {
    id: 'faq',
    backgroundImage: '',
    label: 'Help Center',
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions about your stay at Monipee Hotel.',
  },
];

// Default admin account
const DEFAULT_ADMIN: User & { password: string } = {
  id: 'admin-001',
  email: 'admin@monipee.com',
  name: 'Admin',
  role: 'admin',
  password: 'admin123',
  createdAt: new Date().toISOString(),
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [roomReviews, setRoomReviews] = useState<Record<string, RoomReview[]>>({});
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [settings, setSettings] = useState<HotelSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Initialize default admin if not exists
    const users: Array<User & { password?: string }> = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (!users.find((u) => u.role === 'admin')) {
      users.push(DEFAULT_ADMIN);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    } else {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      setSettings(DEFAULT_SETTINGS);
    }

    // Initialize rooms if not exists
    const storedRooms = localStorage.getItem(ROOMS_KEY);
    if (!storedRooms) {
      const initialRooms: Room[] = [
        {
          id: 'standard',
          name: 'Standard Room',
          type: 'standard',
          price: 350,
          capacity: 2,
          amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Private Bathroom'],
          description: 'Comfortable room with all essential amenities for a pleasant stay.',
          image: '/11.jpeg',
          available: true,
          size: '25m²',
          images: [
            { name: '11.jpeg', size: 0, type: 'image/jpeg', dataUrl: '/11.jpeg' }
          ]
        },
        {
          id: 'deluxe',
          name: 'Deluxe Room',
          type: 'deluxe',
          price: 550,
          capacity: 3,
          amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Balcony', 'Room Service'],
          description: 'Spacious room with premium amenities and city views.',
          image: '/14.jpeg',
          available: true,
          size: '35m²',
          images: [
            { name: '14.jpeg', size: 0, type: 'image/jpeg', dataUrl: '/14.jpeg' }
          ]
        },
        {
          id: 'suite',
          name: 'Executive Suite',
          type: 'suite',
          price: 850,
          capacity: 4,
          amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Jacuzzi', 'Living Area', 'Butler Service'],
          description: 'Luxurious suite with separate living area and premium facilities.',
          image: '/16.jpeg',
          available: true,
          size: '55m²',
          images: [
            { name: '16.jpeg', size: 0, type: 'image/jpeg', dataUrl: '/16.jpeg' }
          ]
        },
      ];
      localStorage.setItem(ROOMS_KEY, JSON.stringify(initialRooms));
      setRooms(initialRooms);
    } else {
      setRooms(JSON.parse(storedRooms));
    }

    // Initialize gallery images
    const storedGallery = localStorage.getItem(GALLERY_KEY);
    let parsedGallery: GalleryImage[] = [];
    try {
      if (storedGallery) {
        parsedGallery = JSON.parse(storedGallery);
      }
    } catch (error) {
      console.error('Failed to parse gallery images:', error);
    }

    if (parsedGallery.length > 0) {
      setGalleryImages(parsedGallery);
    } else {
      const defaultGallery: GalleryImage[] = [
        { id: 'img-1', category: 'Rooms', src: '/11.jpeg', alt: 'Hotel Room' },
        { id: 'img-2', category: 'Rooms', src: '/12.jpeg', alt: 'Comfortable Bed' },
        { id: 'img-3', category: 'Rooms', src: '/13.jpeg', alt: 'Room Interior' },
        { id: 'img-4', category: 'Rooms', src: '/14.jpeg', alt: 'Spacious Suite' },
        { id: 'img-5', category: 'Rooms', src: '/15.jpeg', alt: 'Standard Room' },
        { id: 'img-6', category: 'Rooms', src: '/16.jpeg', alt: 'Deluxe Room' },
        { id: 'img-7', category: 'Exterior', src: '/17.jpeg', alt: 'Hotel Exterior Night View' },
        { id: 'img-8', category: 'Exterior', src: '/18.jpeg', alt: 'Hotel Building' },
        { id: 'img-9', category: 'Exterior', src: '/19.jpeg', alt: 'Entrance' },
        { id: 'img-10', category: 'Exterior', src: '/20.jpeg', alt: 'Hotel Grounds' },
        { id: 'img-11', category: 'Exterior', src: '/21.jpeg', alt: 'Outdoor View' },
        { id: 'img-12', category: 'Amenities', src: '/22.jpeg', alt: 'Hotel Amenities' },
        { id: 'img-13', category: 'Amenities', src: '/23.jpeg', alt: 'Facility View' },
        { id: 'img-14', category: 'Dining', src: '/24.jpeg', alt: 'Restaurant Area' },
        { id: 'img-15', category: 'Dining', src: '/25.jpeg', alt: 'Dining Hall' },
        { id: 'img-16', category: 'Dining', src: '/26.jpeg', alt: 'Buffet Setup' },
        { id: 'img-17', category: 'Exterior', src: '/Kegali-Hotel.jpg', alt: 'Kegali View' },
      ];
      setGalleryImages(defaultGallery);
      localStorage.setItem(GALLERY_KEY, JSON.stringify(defaultGallery));
    }

    // Initialize reviews
    const storedReviews = localStorage.getItem(REVIEWS_KEY);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(DEFAULT_REVIEWS);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(DEFAULT_REVIEWS));
    }

    // Initialize room reviews
    const storedRoomReviews = localStorage.getItem(ROOM_REVIEWS_KEY);
    if (storedRoomReviews) {
      setRoomReviews(JSON.parse(storedRoomReviews));
    } else {
      setRoomReviews({});
      localStorage.setItem(ROOM_REVIEWS_KEY, JSON.stringify({}));
    }

    // Initialize hero sections
    const storedHeroSections = localStorage.getItem(HERO_KEY);
    if (storedHeroSections) {
      setHeroSections(JSON.parse(storedHeroSections));
    } else {
      setHeroSections(DEFAULT_HERO_SECTIONS);
      localStorage.setItem(HERO_KEY, JSON.stringify(DEFAULT_HERO_SECTIONS));
    }

    // Initialize page contents
    const storedPageContents = localStorage.getItem(PAGE_CONTENT_KEY);
    if (storedPageContents) {
      setPageContents(JSON.parse(storedPageContents));
    } else {
      setPageContents(DEFAULT_PAGE_CONTENTS);
      localStorage.setItem(PAGE_CONTENT_KEY, JSON.stringify(DEFAULT_PAGE_CONTENTS));
    }

    // Check for existing session
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (data: Partial<HotelSettings>) => {
    const updated: HotelSettings = { ...settings, ...data };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users: Array<User & { password: string }> = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' };
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const register = async (data: { email: string; password: string; name: string; phone?: string }): Promise<{ success: boolean; error?: string }> => {
    const users: Array<User & { password?: string }> = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

    if (users.find((u) => u.email === data.email)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone,
      password: data.password,
      role: 'customer' as const,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };

    const users: Array<User & { password?: string }> = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex === -1) return { success: false, error: 'User not found' };

    users[userIndex] = { ...users[userIndex], ...data };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    return { success: true };
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const users: Array<User & { password?: string }> = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userExists = users.find(u => u.email === email);

    // Always return success to prevent email enumeration, but log for dev purposes
    if (userExists) {
      // Create a mock token
      const resetToken = Math.random().toString(36).substring(2, 15);
      const resetLink = `/auth/reset-password?token=${resetToken}&email=${email}`;

      // Store token with expiration (simulated in localStorage)
      const resets = JSON.parse(localStorage.getItem('monipee_resets') || '{}');
      resets[email] = { token: resetToken, expires: Date.now() + 3600000 }; // 1 hour
      localStorage.setItem('monipee_resets', JSON.stringify(resets));

      console.log(`[DEV MODE] Password Reset Link: ${window.location.origin}${resetLink}`);
    } else {
      console.log('[DEV MODE] Password reset requested for non-existent email');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'If an account exists with this email, password reset instructions have been sent.'
    };
  };

  const resetPassword = async (password: string, token: string, email: string): Promise<{ success: boolean; message: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const resets = JSON.parse(localStorage.getItem('monipee_resets') || '{}');
    const resetData = resets[email];

    if (!resetData || resetData.token !== token) {
      return { success: false, message: 'Invalid or expired reset token.' };
    }

    if (Date.now() > resetData.expires) {
      return { success: false, message: 'Reset token has expired.' };
    }

    const users: Array<User & { password?: string }> = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return { success: false, message: 'User not found.' };
    }

    // Update password
    users[userIndex].password = password;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Clear used token
    delete resets[email];
    localStorage.setItem('monipee_resets', JSON.stringify(resets));

    return { success: true, message: 'Password successfully updated.' };
  };

  // Booking functions
  const getBookings = (): Booking[] => {
    if (!user) return [];
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    return bookings.filter((b: Booking) => b.userId === user.id);
  };

  const getAllBookings = (): Booking[] => {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return newBooking;
  };

  const updateBooking = (id: string, data: Partial<Booking>) => {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    const index = bookings.findIndex((b: Booking) => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...data };
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    }
  };

  // Message functions
  const getMessages = (): Message[] => {
    if (!user) return [];
    const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    return messages.filter((m: Message) => m.userId === user.id);
  };

  const getAllMessages = (): Message[] => {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
  };

  const addMessage = (message: Omit<Message, 'id' | 'createdAt' | 'status'>): Message => {
    const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    messages.push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    return newMessage;
  };

  const updateMessage = (id: string, data: Partial<Message>) => {
    const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    const index = messages.findIndex((m: Message) => m.id === id);
    if (index !== -1) {
      messages[index] = { ...messages[index], ...data };
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  };

  const getAllUsers = (): User[] => {
    const users: Array<User & { password?: string }> = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.map(({ password, ...user }) => user);
  };

  // Room functions
  const getRooms = (): Room[] => {
    return JSON.parse(localStorage.getItem(ROOMS_KEY) || '[]');
  };

  const addRoom = (room: Room) => {
    const currentRooms = [...rooms, room];
    setRooms(currentRooms);
    localStorage.setItem(ROOMS_KEY, JSON.stringify(currentRooms));
  };

  const updateRoom = (id: string, data: Partial<Room>) => {
    const currentRooms = rooms.map(room =>
      room.id === id ? { ...room, ...data } : room
    );
    setRooms(currentRooms);
    localStorage.setItem(ROOMS_KEY, JSON.stringify(currentRooms));
  };

  const deleteRoom = (id: string) => {
    const currentRooms = rooms.filter(room => room.id !== id);
    setRooms(currentRooms);
    localStorage.setItem(ROOMS_KEY, JSON.stringify(currentRooms));
  };

  const addGalleryImage = (image: Omit<GalleryImage, 'id'>) => {
    const newImage = { ...image, id: Date.now().toString() };
    const updatedGallery = [...galleryImages, newImage];
    setGalleryImages(updatedGallery);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(updatedGallery));
  };

  const deleteGalleryImage = (id: string) => {
    const updatedGallery = galleryImages.filter(img => img.id !== id);
    setGalleryImages(updatedGallery);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(updatedGallery));
  };

  const addReview = (review: Omit<Review, 'id'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
  };

  const updateReview = (id: string, data: Partial<Omit<Review, 'id'>>) => {
    const updated = reviews.map(r => (r.id === id ? { ...r, ...data } : r));
    setReviews(updated);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
  };

  const getRoomReviews = (roomId: string): RoomReview[] => {
    const list = roomReviews[roomId] || [];
    return [...list]
      .map((r) => ({ ...r, status: r.status || 'approved' }))
      .filter((r) => r.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getAllRoomReviews = (): RoomReview[] => {
    const all = Object.values(roomReviews).flat();
    return all
      .map((r) => ({ ...r, status: r.status || 'approved' }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const updateRoomReviewStatus = (reviewId: string, status: RoomReview['status']) => {
    const updated: Record<string, RoomReview[]> = {};
    for (const [rid, list] of Object.entries(roomReviews)) {
      updated[rid] = list.map((r) => (r.id === reviewId ? { ...r, status } : r));
    }
    setRoomReviews(updated);
    localStorage.setItem(ROOM_REVIEWS_KEY, JSON.stringify(updated));
  };

  const addRoomReview = (roomId: string, data: { rating: number; comment: string }) => {
    if (!user) return { success: false, error: 'Sign in required' };

    const rating = Math.max(1, Math.min(5, Number(data.rating) || 0));
    const comment = data.comment.trim();
    if (!comment) return { success: false, error: 'Comment is required' };
    if (!rating) return { success: false, error: 'Rating is required' };

    const newReview: RoomReview = {
      id: `room-review-${Date.now()}`,
      roomId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    const updated: Record<string, RoomReview[]> = {
      ...roomReviews,
      [roomId]: [newReview, ...(roomReviews[roomId] || [])],
    };

    setRoomReviews(updated);
    localStorage.setItem(ROOM_REVIEWS_KEY, JSON.stringify(updated));
    return { success: true };
  };

  const getHeroSection = (id: string): HeroSection => {
    return heroSections.find(s => s.id === id) || DEFAULT_HERO_SECTIONS.find(s => s.id === id) || {
      id,
      backgroundImage: '',
      label: '',
      title: '',
      subtitle: '',
    };
  };

  const updateHeroSection = (id: string, data: Partial<Omit<HeroSection, 'id'>>) => {
    const current = heroSections.length > 0 ? heroSections : DEFAULT_HERO_SECTIONS;
    const exists = current.some(s => s.id === id);

    const updated = exists
      ? current.map(s => (s.id === id ? { ...s, ...data } : s))
      : [...current, { id, backgroundImage: '', label: '', title: '', subtitle: '', ...data }];

    setHeroSections(updated);
    localStorage.setItem(HERO_KEY, JSON.stringify(updated));
  };

  const getPageContent = (id: string): PageContent => {
    return pageContents.find(p => p.id === id) || DEFAULT_PAGE_CONTENTS.find(p => p.id === id) || {
      id,
      images: {},
      content: {},
    };
  };

  const updatePageContent = (id: string, data: Partial<Omit<PageContent, 'id'>>) => {
    const current = pageContents.length > 0 ? pageContents : DEFAULT_PAGE_CONTENTS;
    const exists = current.some(p => p.id === id);
    const existing = getPageContent(id);

    const merged: PageContent = {
      id,
      images: { ...existing.images, ...(data.images || {}) },
      content: { ...existing.content, ...(data.content || {}) },
    };

    const updated = exists ? current.map(p => (p.id === id ? merged : p)) : [...current, merged];
    setPageContents(updated);
    localStorage.setItem(PAGE_CONTENT_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      getBookings,
      addBooking,
      updateBooking,
      getAllBookings,
      getMessages,
      addMessage,
      getAllMessages,
      updateMessage,
      getAllUsers,
      rooms,
      getRooms,
      addRoom,
      updateRoom,
      deleteRoom,
      galleryImages,
      addGalleryImage,
      deleteGalleryImage,
      reviews,
      addReview,
      updateReview,
      deleteReview,
      getRoomReviews,
      addRoomReview,
      getAllRoomReviews,
      updateRoomReviewStatus,
      heroSections,
      getHeroSection,
      updateHeroSection,
      pageContents,
      getPageContent,
      updatePageContent,
      settings,
      updateSettings,
      forgotPassword,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
