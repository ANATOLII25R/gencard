import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/progetti/[id]
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) {
    return NextResponse.json({ error: "Progetto non trovato" }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PATCH /api/progetti/[id] — salva canvas data + thumbnail
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const result = await prisma.project.updateMany({
    where: { id, userId: session.user.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.canvasData !== undefined && { canvasData: body.canvasData }),
      ...(body.thumbnail !== undefined && { thumbnail: body.thumbnail }),
    },
  });

  // Invalida il cache dashboard dopo il salvataggio
  revalidateTag("projects");

  return NextResponse.json({ success: true, updated: result.count });
}

// DELETE /api/progetti/[id]
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.project.deleteMany({
    where: { id, userId: session.user.id },
  });

  // Invalida il cache dashboard dopo la cancellazione
  revalidateTag("projects");

  return NextResponse.json({ success: true });
}
