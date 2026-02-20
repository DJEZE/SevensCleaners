export type { User, CustomerProfile, CleanerProfile, Booking, Payment, Assignment, MessageLog } from "@prisma/client";

export interface BookingFormData {
  serviceType: "ONE_BEDROOM" | "TWO_BEDROOM";
  addOns: string[];
  address: string;
  scheduleDate: string;
  scheduleWindow: string;
  notes: string;
  price: number;
  durationMinutes: number;
}

export interface CleanerOnboardingData {
  name: string;
  phone: string;
  email: string;
  serviceArea: string;
  rate: number;
  availability: Record<string, string[]>;
  suppliesIncluded: boolean;
}
