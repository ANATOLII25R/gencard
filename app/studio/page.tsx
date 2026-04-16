import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import PanoramicaClient from "./PanoramicaClient";

const getRecentProjects = unstable_cache(
  async (userId: string) => prisma.project.findMany({
    where: { userId }, orderBy: { updatedAt: "desc" }, take: 5,
  }),
  ["recent-projects"],
  { revalidate: false, tags: ["projects"] }
);

export default async function PanoramicaPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const recentProjects = await getRecentProjects(session.user.id);
  const firstName = session.user.name?.split(" ")[0] || "Designer";

  const [completedCount, inProgressCount] = await Promise.all([
    prisma.project.count({ where: { userId: session.user.id, status: "COMPLETED" } }),
    prisma.project.count({ where: { userId: session.user.id, status: "IN_PROGRESS" } }),
  ]);

  return (
    <PanoramicaClient 
      recentProjects={recentProjects} 
      firstName={firstName}
      completedCount={completedCount}
      inProgressCount={inProgressCount}
    />
  );
}
