import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(["ADMIN"]);

    const { cleanerId } = await req.json() as { cleanerId: string };

    const cleaner = await prisma.cleanerProfile.findUnique({ where: { id: cleanerId } });
    if (!cleaner) return NextResponse.json({ error: "Cleaner not found" }, { status: 404 });

    const booking = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Upsert assignment
    const assignment = await prisma.assignment.upsert({
      where: { bookingId: params.id },
      create: {
        bookingId: params.id,
        cleanerId,
        status: "PENDING",
      },
      update: {
        cleanerId,
        status: "PENDING",
      },
    });

    // Update booking status to ASSIGNED
    await prisma.booking.update({
      where: { id: params.id },
      data: { status: "ASSIGNED" },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Assign cleaner error:", error);
    return NextResponse.json({ error: "Unauthorized or failed" }, { status: 403 });
  }
}
