import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { unstable_cache } from "next/cache";

// ── Cached DB queries (re-validates only on manual revalidation) ──

const getUserProjects = unstable_cache(
  async (userId: string) =>
    prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
  ["user-projects"],
  { tags: ["projects"] }
);

const getUserSubscription = unstable_cache(
  async (userId: string) =>
    prisma.subscription.findUnique({ where: { userId } }),
  ["user-subscription"],
  { tags: ["subscription"] }
);

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const [projects, subscription] = await Promise.all([
    getUserProjects(session.user.id),
    getUserSubscription(session.user.id),
  ]);

  return (
    <DashboardClient
      user={session.user}
      projects={projects}
      plan={subscription?.plan ?? "FREE"}
    />
  );
}
