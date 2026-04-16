import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditorClient from "./EditorClient";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/accedi");

  const { id } = await params;

  // If id is "new", create a new project
  if (id === "new") {
    const newProject = await prisma.project.create({
      data: {
        name: "Nuovo Design",
        width: 800,
        height: 600,
        userId: session.user.id,
        status: "IN_PROGRESS",
        canvasData: JSON.stringify({ version: "6.0.0", objects: [] }),
      },
    });
    return (
      <EditorClient
        project={newProject}
        userId={session.user.id}
      />
    );
  }

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) redirect("/studio/design");

  return (
    <EditorClient
      project={project}
      userId={session.user.id}
    />
  );
}

