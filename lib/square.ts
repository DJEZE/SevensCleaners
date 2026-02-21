import { Client, Environment } from "square";

// Lazily initialized to avoid module-load failures during build
let _squareClient: Client | null = null;

export function getSquareClient(): Client {
  if (!_squareClient) {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("SQUARE_ACCESS_TOKEN environment variable is not set");
    }
    _squareClient = new Client({
      accessToken,
      environment:
        process.env.SQUARE_ENVIRONMENT === "production"
          ? Environment.Production
          : Environment.Sandbox,
    });
  }
  return _squareClient;
}

export function getSquareLocationId(): string {
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  if (!locationId) {
    throw new Error("NEXT_PUBLIC_SQUARE_LOCATION_ID environment variable is not set");
  }
  return locationId;
}

// Keep the constant export for backwards compatibility (may be undefined if env var not set)
export const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!;
