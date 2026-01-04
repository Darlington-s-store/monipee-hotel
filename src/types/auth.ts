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
