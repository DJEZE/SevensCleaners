import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// Simple suggestion: return top 3 approved active cleaners not busy on booking date
export async function GET(req: NextRequest) {
  try {
    await requireRole(["ADMIN"]);

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const startOfDay = new Date(booking.scheduleDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(booking.scheduleDate);
    endOfDay.setHours(23, 59, 59, 999);

    const busyIds = (await prisma.assignment.findMany({
      where: {
        booking: { scheduleDate: { gte: startOfDay, lte: endOfDay }, status: { notIn: ["CANCELLED", "COMPLETED"] } },
        status: { notIn: ["DECLINED"] },
      },
      select: { cleanerId: true },
    })).map((a) => a.cleanerId);

    const suggestions = await prisma.cleanerProfile.findMany({
      where: { approved: true, active: true, id: { notIn: busyIds } },
      take: 3,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Suggest cleaners error:", error);
    return NextResponse.json({ error: "Unauthorized or failed" }, { status: 403 });
  }
}
