import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { cleanerProfile: true },
    });

    if (!user?.cleanerProfile) {
      return NextResponse.json({ error: "No profile" }, { status: 404 });
    }

    return NextResponse.json(user.cleanerProfile);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
