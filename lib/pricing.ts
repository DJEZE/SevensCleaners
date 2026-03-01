export const PROCESSING_FEE_PERCENT = 0.029; // Stripe: 2.9%
export const PROCESSING_FEE_FIXED = 0.30;   // Stripe: $0.30

/** Returns the processing fee to add on top of a given amount. */
export function calculateProcessingFee(amount: number): number {
  return Math.round((amount * PROCESSING_FEE_PERCENT + PROCESSING_FEE_FIXED) * 100) / 100;
}

export const PRICING = {
  services: {
    ONE_BEDROOM: { label: "1 Bedroom", price: 120, durationMinutes: 90 },
    TWO_BEDROOM: { label: "2 Bedroom", price: 175, durationMinutes: 120 },
  },
  addOns: {
    DEEP_CLEAN:       { label: "Deep Clean",        price: 50, durationMinutes: 45 },
    EXTRA_BEDROOM:    { label: "Extra Bedroom",     price: 40, durationMinutes: 30 },
    INSIDE_OVEN:      { label: "Inside Oven",        price: 25, durationMinutes: 20 },
    INSIDE_FRIDGE:    { label: "Inside Fridge",      price: 25, durationMinutes: 20 },
    MOVE_IN_OUT:      { label: "Move In / Move Out", price: 75, durationMinutes: 60 },
    PET_HAIR:         { label: "Pet Hair",           price: 30, durationMinutes: 20 },
  },
} as const;

export type ServiceType = keyof typeof PRICING.services;
export type AddOnType = keyof typeof PRICING.addOns;

export function calculateTotal(
  serviceType: ServiceType,
  selectedAddOns: AddOnType[]
): { price: number; durationMinutes: number } {
  const service = PRICING.services[serviceType];
  let price = service.price;
  let durationMinutes = service.durationMinutes;

  for (const addOn of selectedAddOns) {
    price += PRICING.addOns[addOn].price;
    durationMinutes += PRICING.addOns[addOn].durationMinutes;
  }

  return { price, durationMinutes };
}
