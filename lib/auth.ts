import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getOrCreateUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

  // Upsert user in our DB
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: {
      clerkId: userId,
      email,
      role: "CUSTOMER",
    },
    include: {
      customerProfile: true,
      cleanerProfile: true,
    },
  });

  return user;
}

export async function requireRole(allowedRoles: string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}
