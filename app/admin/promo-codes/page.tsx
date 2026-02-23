import { prisma } from "@/lib/prisma";
import PromoCodesClient from "./PromoCodesClient";

export const dynamic = "force-dynamic";

export default async function AdminPromoCodesPage() {
  const codes = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <PromoCodesClient initialCodes={codes} />;
}
