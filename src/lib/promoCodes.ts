import { differenceInDays } from 'date-fns';

export interface PromoCode {
  code: string;
  name: string;
  discountType: 'percentage' | 'free_night';
  discountValue: number;
  condition: (checkIn: Date, checkOut: Date, nights: number) => boolean;
  errorMessage: string;
}

export const promoCodes: PromoCode[] = [
  {
    code: 'EARLY20',
    name: 'Early Bird Special',
    discountType: 'percentage',
    discountValue: 20,
    condition: (checkIn) => {
      const daysInAdvance = differenceInDays(checkIn, new Date());
      return daysInAdvance >= 14;
    },
    errorMessage: 'This code requires booking at least 14 days in advance.',
  },
  {
    code: 'STAY3PAY2',
    name: 'Stay 3, Pay 2',
    discountType: 'free_night',
    discountValue: 1, // 1 free night
    condition: (_, __, nights) => nights >= 3,
    errorMessage: 'This code requires a minimum stay of 3 nights.',
  },
  {
    code: 'WEEKEND15',
    name: 'Weekend Getaway',
    discountType: 'percentage',
    discountValue: 15,
    condition: (checkIn) => {
      const dayOfWeek = checkIn.getDay();
      // Friday = 5, Saturday = 6, Sunday = 0
      return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
    },
    errorMessage: 'This code is only valid for Friday-Sunday check-ins.',
  },
];

export interface PromoValidationResult {
  valid: boolean;
  promo?: PromoCode;
  errorMessage?: string;
  discountAmount?: number;
}

export function validatePromoCode(
  code: string,
  checkIn: Date | undefined,
  checkOut: Date | undefined,
  nights: number,
  roomPrice: number,
  roomCount: number
): PromoValidationResult {
  if (!code.trim()) {
    return { valid: false, errorMessage: 'Please enter a promo code.' };
  }

  if (!checkIn || !checkOut) {
    return { valid: false, errorMessage: 'Please select check-in and check-out dates first.' };
  }

  const normalizedCode = code.trim().toUpperCase();
  const promo = promoCodes.find((p) => p.code === normalizedCode);

  if (!promo) {
    return { valid: false, errorMessage: 'Invalid promo code.' };
  }

  if (!promo.condition(checkIn, checkOut, nights)) {
    return { valid: false, errorMessage: promo.errorMessage };
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (promo.discountType === 'percentage') {
    const subtotal = roomPrice * nights * roomCount;
    discountAmount = subtotal * (promo.discountValue / 100);
  } else if (promo.discountType === 'free_night') {
    discountAmount = roomPrice * promo.discountValue * roomCount;
  }

  return {
    valid: true,
    promo,
    discountAmount,
  };
}
