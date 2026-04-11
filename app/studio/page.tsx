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
  return <PanoramicaClient recentProjects={recentProjects} firstName={firstName} />;
}
