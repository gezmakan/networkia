import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// Default circles for new users
const DEFAULT_CIRCLES = [
  { name: "Family", isActive: true, order: 0 },
  { name: "Friend", isActive: true, order: 1 },
  { name: "Relative", isActive: true, order: 2 },
  { name: "Work", isActive: true, order: 3 },
  { name: "Acquaintance", isActive: true, order: 4 },
  { name: "Circle 6", isActive: false, order: 5 },
  { name: "Circle 7", isActive: false, order: 6 },
  { name: "Circle 8", isActive: false, order: 7 },
  { name: "Circle 9", isActive: false, order: 8 },
  { name: "Circle 10", isActive: false, order: 9 },
];

// POST /api/circles/init - Initialize default circles for new user
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Check if user already has circles
    const existingCircles = await prisma.circle.findMany({
      where: {
        userId,
      },
    });

    if (existingCircles.length > 0) {
      return Response.json({
        message: "Circles already initialized",
        circles: existingCircles,
      });
    }

    // Create default circles
    const circles = await Promise.all(
      DEFAULT_CIRCLES.map((circle) =>
        prisma.circle.create({
          data: {
            userId,
            name: circle.name,
            isActive: circle.isActive,
            order: circle.order,
          },
        })
      )
    );

    return Response.json({
      message: "Circles initialized",
      circles,
    });
  } catch (error) {
    console.error("Error initializing circles:", error);
    return Response.json(
      { error: "Failed to initialize circles" },
      { status: 500 }
    );
  }
}
