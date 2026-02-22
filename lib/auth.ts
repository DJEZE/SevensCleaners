import { cookies } from "next/headers";
import { prisma } from "./prisma";

export function getAdminSession(): boolean {
  const session = cookies().get("admin-session")?.value;
  return session === (process.env.ADMIN_PASSWORD ?? "admin");
}

export function requireRole(_allowedRoles?: string[]): void {
  if (!getAdminSession()) throw new Error("Unauthorized");
}

export async function getCurrentCleaner() {
  const cleanerId = cookies().get("cleaner-id")?.value;
  if (!cleanerId) return null;
  return prisma.cleanerProfile.findUnique({ where: { id: cleanerId } });
}

// Legacy stub — no customer accounts; returns null
export async function getOrCreateUser() {
  return null;
}
