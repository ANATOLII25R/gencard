import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import StudioShell from "./StudioShell";
import type { PlanType } from "@/types";

const getProjectCount = unstable_cache(
  async (userId: string) => prisma.project.count({ where: { userId } }),
  ["project-count"],
  { revalidate: false, tags: ["projects"] }
);

const getUserSubscription = unstable_cache(
  async (userId: string) => prisma.subscription.findUnique({ where: { userId } }),
  ["user-subscription"],
  { revalidate: false, tags: ["subscription"] }
);

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const [projectCount, subscription] = await Promise.all([
    getProjectCount(session.user.id),
    getUserSubscription(session.user.id),
  ]);

  const plan = (subscription?.plan ?? "FREE") as PlanType;

  return (
    <StudioShell user={session.user} plan={plan} projectCount={projectCount}>
      {children}
    </StudioShell>
  );
}
