import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// GET /api/circles - Get user's circles
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const circles = await prisma.circle.findMany({
    where: {
      userId,
    },
    orderBy: {
      order: "asc",
    },
  });

  return Response.json(circles);
}

// POST /api/circles - Create or update circles (batch upsert)
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { circles } = body;

    if (!Array.isArray(circles)) {
      return Response.json(
        { error: "circles must be an array" },
        { status: 400 }
      );
    }

    // Upsert each circle
    const results = await Promise.all(
      circles.map((circle: any) =>
        prisma.circle.upsert({
          where: {
            userId_name: {
              userId,
              name: circle.name,
            },
          },
          update: {
            isActive: circle.isActive,
            order: circle.order ?? 0,
          },
          create: {
            userId,
            name: circle.name,
            isActive: circle.isActive ?? true,
            order: circle.order ?? 0,
          },
        })
      )
    );

    return Response.json(results);
  } catch (error) {
    console.error("Error upserting circles:", error);
    return Response.json(
      { error: "Failed to update circles" },
      { status: 500 }
    );
  }
}
