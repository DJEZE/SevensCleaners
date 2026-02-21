import { Client, Environment } from "square";

// Lazily initialized to avoid module-load failures during build
let _squareClient: Client | null = null;

export function getSquareClient(): Client {
  if (!_squareClient) {
    _squareClient = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN!,
      environment:
        process.env.SQUARE_ENVIRONMENT === "production"
          ? Environment.Production
          : Environment.Sandbox,
    });
  }
  return _squareClient;
}

export const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!;
