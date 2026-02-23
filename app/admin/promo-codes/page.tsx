import { prisma } from "@/lib/prisma";
import PromoCodesClient from "./PromoCodesClient";

export const dynamic = "force-dynamic";

export default async function AdminPromoCodesPage() {
  const codes = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = codes.map((c) => ({
    ...c,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
  }));

  return <PromoCodesClient initialCodes={serialized} />;
}
