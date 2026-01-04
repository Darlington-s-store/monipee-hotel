// EmailJS Configuration
// To use this service, you need to:
// 1. Sign up at https://www.emailjs.com
// 2. Create an email service (connect Gmail, Outlook, etc.)
// 3. Create an email template with the following variables:
//    - guest_name, guest_email, guest_phone
//    - room_name, check_in, check_out
//    - nights, guests, room_count
//    - subtotal, discount, tax, total
//    - booking_reference, special_requests
// 4. Replace the values below with your actual credentials

export const EMAIL_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
  STATUS_TEMPLATE_ID: 'YOUR_STATUS_TEMPLATE_ID', // Replace with your EmailJS status update template ID
};

export interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: string;
  roomCount: string;
  subtotal: string;
  discount: string;
  total: string;
  bookingReference: string;
  specialRequests: string;
}

export function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MH-${timestamp}-${random}`;
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<{ success: boolean; error?: string }> {
  // Check if EmailJS is configured
  if (EMAIL_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID') {
    console.log('EmailJS not configured. Email data:', data);
    return { 
      success: true, // Return success for demo purposes
    };
  }

  try {
    // Dynamically import EmailJS only when needed
    const emailjs = await import('@emailjs/browser');
    
    await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      {
        guest_name: data.guestName,
        guest_email: data.guestEmail,
        guest_phone: data.guestPhone,
        room_name: data.roomName,
        check_in: data.checkIn,
        check_out: data.checkOut,
        nights: data.nights,
        guests: data.guests,
        room_count: data.roomCount,
        subtotal: data.subtotal,
        discount: data.discount,
        total: data.total,
        booking_reference: data.bookingReference,
        special_requests: data.specialRequests || 'None',
        to_email: data.guestEmail,
      },
      EMAIL_CONFIG.PUBLIC_KEY
    );

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

export async function sendBookingStatusUpdate(data: {
  guestName: string;
  guestEmail: string;
  bookingId: string;
  status: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  total: string;
}): Promise<{ success: boolean; error?: string }> {
  if (EMAIL_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID') {
    console.log('EmailJS not configured. Status update email data:', data);
    return { success: true };
  }

  try {
    const emailjs = await import('@emailjs/browser');
    await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.STATUS_TEMPLATE_ID || EMAIL_CONFIG.TEMPLATE_ID,
      {
        guest_name: data.guestName,
        guest_email: data.guestEmail,
        booking_id: data.bookingId,
        booking_status: data.status,
        room_name: data.roomName,
        check_in: data.checkIn,
        check_out: data.checkOut,
        total: data.total,
        to_email: data.guestEmail,
      },
      EMAIL_CONFIG.PUBLIC_KEY
    );
    return { success: true };
  } catch (error) {
    console.error('Failed to send status update email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send status update email' 
    };
  }
}
