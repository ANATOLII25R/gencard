import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

// GET /api/progetti — список проектів (кешується на клієнті)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      thumbnail: true,
      width: true,
      height: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json(projects, {
    headers: {
      // Browser cache: 30s, stale-while-revalidate: 60s
      "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
    },
  });
}

// POST /api/progetti — crea un nuovo progetto
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  // Check subscription plan limits
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: { plan: true },
  });

  const plan = subscription?.plan ?? "FREE";
  if (plan === "FREE") {
    const count = await prisma.project.count({
      where: { userId: session.user.id },
    });
    if (count >= 3) {
      return NextResponse.json(
        { error: "Limite progetti raggiunto. Aggiorna al piano Pro." },
        { status: 403 }
      );
    }
  }

  const body = await req.json();
  const project = await prisma.project.create({
    data: {
      name: body.name || "Nuovo Volantino",
      description: body.description ?? null,
      width: body.width || 800,
      height: body.height || 600,
      userId: session.user.id,
      canvasData: JSON.stringify({ version: "6.0.0", objects: [] }),
    },
  });

  // Invalida il cache della dashboard
  revalidateTag("projects");

  return NextResponse.json(project, { status: 201 });
}
