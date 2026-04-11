import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import DesignClient from "./DesignClient";
import type { PlanType } from "@/types";

const getUserProjects = unstable_cache(
  async (userId: string) => prisma.project.findMany({
    where: { userId }, orderBy: { updatedAt: "desc" },
  }),
  ["user-projects"],
  { revalidate: false, tags: ["projects"] }
);

const getUserSubscription = unstable_cache(
  async (userId: string) => prisma.subscription.findUnique({ where: { userId } }),
  ["user-subscription"],
  { revalidate: false, tags: ["subscription"] }
);

export default async function DesignPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [projects, subscription] = await Promise.all([
    getUserProjects(session.user.id),
    getUserSubscription(session.user.id),
  ]);

  const plan = (subscription?.plan ?? "FREE") as PlanType;

  return <DesignClient projects={projects} plan={plan} />;
}
