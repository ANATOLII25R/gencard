import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import DesignClient from "./DesignClient";

const getUserProjects = unstable_cache(
  async (userId: string) => prisma.project.findMany({
    where: { userId }, orderBy: { updatedAt: "desc" },
  }),
  ["user-projects"],
  { revalidate: false, tags: ["projects"] }
);

export default async function DesignPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const projects = await getUserProjects(session.user.id);

  return <DesignClient projects={projects} />;
}
