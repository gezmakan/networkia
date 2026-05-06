import { createHash } from "crypto";
import { auth } from "@/auth";
import { getDefaultCircleSettings } from "@/lib/circle-settings";
import { serializeContact } from "@/lib/contact-response";
import { prisma } from "@/lib/prisma";

async function getOrCreateCircles(userId: string) {
  const existingCircles = await prisma.circle.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });

  if (existingCircles.length > 0) {
    return existingCircles;
  }

  return Promise.all(
    getDefaultCircleSettings().map((circle, order) =>
      prisma.circle.create({
        data: {
          userId,
          name: circle.name || `Circle ${order + 1}`,
          isActive: circle.isActive,
          order,
        },
      })
    )
  );
}

const REVALIDATE_HEADERS = {
  "Cache-Control": "private, no-cache, must-revalidate",
} as const;

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const [contacts, circles] = await Promise.all([
    prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { interactions: true },
    }),
    getOrCreateCircles(userId),
  ]);

  const payload = {
    user: {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
    },
    contacts: contacts.map(serializeContact),
    circles,
  };

  const body = JSON.stringify(payload);
  const etag = `"${createHash("sha1").update(body).digest("base64url")}"`;

  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag, ...REVALIDATE_HEADERS },
    });
  }

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ETag: etag,
      ...REVALIDATE_HEADERS,
    },
  });
}
