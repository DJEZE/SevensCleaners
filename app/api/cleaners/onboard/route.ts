import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

async function uploadFile(file: File, prefix: string): Promise<string | null> {
  if (!ALLOWED_TYPES.includes(file.type)) return null;
  if (file.size > MAX_SIZE) return null;

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${prefix}-${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await getSupabaseAdmin().storage
    .from("cleaner-ids")
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  return data.path;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const serviceArea = formData.get("serviceArea") as string;
    const rate = parseFloat(formData.get("rate") as string);
    const suppliesIncluded = formData.get("suppliesIncluded") === "true";
    const availabilityRaw = formData.get("availability") as string;
    const availability = JSON.parse(availabilityRaw ?? "[]");
    const idFrontFile = formData.get("idFront") as File | null;
    const idBackFile = formData.get("idBack") as File | null;

    if (!name || !phone || !email || !serviceArea || !idFrontFile || !idBackFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upload ID files
    const [idFrontPath, idBackPath] = await Promise.all([
      uploadFile(idFrontFile, "front"),
      uploadFile(idBackFile, "back"),
    ]);

    if (!idFrontPath || !idBackPath) {
      return NextResponse.json({ error: "Invalid file type or size. Use JPEG, PNG, WebP, or PDF under 5MB." }, { status: 400 });
    }

    // Upsert user in DB
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email, role: "CLEANER" },
      create: { clerkId: userId, email, role: "CLEANER" },
    });

    // Create cleaner profile
    const profile = await prisma.cleanerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        name, phone, email, serviceArea, rate,
        suppliesIncluded,
        availability,
        idFrontUrl: idFrontPath,
        idBackUrl: idBackPath,
        approved: false,
        active: true,
      },
      update: {
        name, phone, email, serviceArea, rate,
        suppliesIncluded,
        availability,
        idFrontUrl: idFrontPath,
        idBackUrl: idBackPath,
      },
    });

    return NextResponse.json({ profileId: profile.id });
  } catch (error) {
    console.error("Cleaner onboard error:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
