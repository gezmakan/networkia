import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// GET /api/interactions?contactId={id} - Get interactions for contact
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");

  if (!contactId) {
    return Response.json(
      { error: "contactId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Verify the contact belongs to the user
    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
      },
    });

    if (!contact) {
      return Response.json({ error: "Contact not found" }, { status: 404 });
    }

    if (contact.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get interactions for the contact
    const interactions = await prisma.interaction.findMany({
      where: {
        contactId,
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return Response.json(interactions);
  } catch (error) {
    console.error("Error fetching interactions:", error);
    return Response.json(
      { error: "Failed to fetch interactions" },
      { status: 500 }
    );
  }
}

// POST /api/interactions - Create interaction
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { contactId, title, body: interactionBody, date } = body;

    if (!contactId || !interactionBody) {
      return Response.json(
        { error: "contactId and body are required" },
        { status: 400 }
      );
    }

    // Verify the contact belongs to the user
    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
      },
    });

    if (!contact) {
      return Response.json({ error: "Contact not found" }, { status: 404 });
    }

    if (contact.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create the interaction
    const interaction = await prisma.interaction.create({
      data: {
        userId: session.user.id,
        contactId,
        title: title || "",
        body: interactionBody,
        date: date ? new Date(date) : new Date(),
      },
    });

    // Optionally update lastContact on the contact
    await prisma.contact.update({
      where: {
        id: contactId,
      },
      data: {
        lastContact: interaction.date,
      },
    });

    return Response.json(interaction);
  } catch (error) {
    console.error("Error creating interaction:", error);
    return Response.json(
      { error: "Failed to create interaction" },
      { status: 500 }
    );
  }
}
