import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("cleaner-id");
  return NextResponse.redirect(new URL("/cleaner/login", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
}
