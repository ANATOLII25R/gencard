import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import ImpostazioniClient from "./ImpostazioniClient";
import type { PlanType } from "@/types";

const getUserSubscription = unstable_cache(
  async (userId: string) => prisma.subscription.findUnique({ where: { userId } }),
  ["user-subscription"],
  { revalidate: false, tags: ["subscription"] }
);

export default async function ImpostazioniPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const subscription = await getUserSubscription(session.user.id);
  const plan = (subscription?.plan ?? "FREE") as PlanType;
  return <ImpostazioniClient user={session.user} plan={plan} />;
}
