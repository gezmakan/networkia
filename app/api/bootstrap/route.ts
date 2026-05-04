import { auth } from "@/auth";
import { getDefaultCircleSettings } from "@/lib/circle-settings";
import { prisma } from "@/lib/prisma";

function computeDaysAgo(lastContact: Date | null): number | null {
  if (!lastContact) {
    return null;
  }
  const now = new Date();
  const diff = now.getTime() - lastContact.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

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

export async function GET() {
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

  return Response.json({
    user: {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
    },
    contacts: contacts.map((contact) => ({
      ...contact,
      daysAgo: computeDaysAgo(contact.lastContact),
      nextMeetCadence: contact.nextMeetCadence
        ? contact.nextMeetCadence.toLowerCase()
        : null,
      interactionNotes: contact.interactions.map((interaction) => ({
        id: interaction.id,
        title: interaction.title,
        body: interaction.body,
        date: interaction.date.toISOString(),
      })),
    })),
    circles,
  });
}
