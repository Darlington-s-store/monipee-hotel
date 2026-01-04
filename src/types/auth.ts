export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: 'customer' | 'admin';
    createdAt: string;
}

export interface Booking {
    id: string;
    userId: string;
    roomType: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: string;
    guestDetails: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        specialRequests?: string;
    };
}

export interface Room {
    id: string;
    name: string;
    type: string;
    price: number;
    capacity: number;
    amenities: string[];
    description: string;
    image: string;
    available: boolean;
    size?: string;
    images?: Array<{
        name: string;
        size: number;
        type: string;
        dataUrl: string;
    }>;
}

export interface Message {
    id: string;
    userId: string;
    subject: string;
    content: string;
    status: 'unread' | 'read' | 'replied';
    createdAt: string;
    replies?: {
        content: string;
        createdAt: string;
        isAdmin: boolean;
    }[];
}

export interface GalleryImage {
    id: string;
    category: string;
    src: string;
    alt: string;
    category_id?: string;
}

export interface Review {
    id: string;
    name: string;
    date: string;
    rating: number;
    comment: string;
    status: 'published' | 'pending' | 'hidden';
}

export interface RoomReview {
    id: string;
    roomId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface HeroSection {
    id: string;
    backgroundImage: string;
    label: string;
    title: string;
    subtitle: string;
}

export interface PageContent {
    id: string;
    images: Record<string, string>;
    content: Record<string, string>;
}

export interface HotelSettings {
    hotelName: string;
    email: string;
    phone: string;
    address: string;
    checkInTime: string;
    checkOutTime: string;
    currency: string;
    taxRate: number;
    enableBookings: boolean;
    enableReviews: boolean;
    maintenanceMode: boolean;
}

export interface AuthContextType {
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
