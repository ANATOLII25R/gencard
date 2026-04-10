import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { unstable_cache } from "next/cache";

// ── Cached DB queries (re-validates every 30 seconds or on manual revalidation) ──

const getUserProjects = unstable_cache(
  async (userId: string) =>
    prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
  ["user-projects"],
  { revalidate: 30, tags: ["projects"] }
);

const getUserSubscription = unstable_cache(
  async (userId: string) =>
    prisma.subscription.findUnique({ where: { userId } }),
  ["user-subscription"],
  { revalidate: 60, tags: ["subscription"] }
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
