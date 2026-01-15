import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// PATCH /api/interactions/[id] - Update interaction
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if interaction exists and user owns it
    const existingInteraction = await prisma.interaction.findUnique({
      where: {
        id,
      },
    });

    if (!existingInteraction) {
      return Response.json(
        { error: "Interaction not found" },
        { status: 404 }
      );
    }

    if (existingInteraction.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, body: interactionBody, date } = body;

    // Build update data object (only include provided fields)
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (interactionBody !== undefined) updateData.body = interactionBody;
    if (date !== undefined) updateData.date = new Date(date);

    const interaction = await prisma.interaction.update({
      where: {
        id,
      },
      data: updateData,
    });

    return Response.json(interaction);
  } catch (error) {
    console.error("Error updating interaction:", error);
    return Response.json(
      { error: "Failed to update interaction" },
      { status: 500 }
    );
  }
}

// DELETE /api/interactions/[id] - Delete interaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if interaction exists and user owns it
    const existingInteraction = await prisma.interaction.findUnique({
      where: {
        id,
      },
    });

    if (!existingInteraction) {
      return Response.json(
        { error: "Interaction not found" },
        { status: 404 }
      );
    }

    if (existingInteraction.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.interaction.delete({
      where: {
        id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting interaction:", error);
    return Response.json(
      { error: "Failed to delete interaction" },
      { status: 500 }
    );
  }
}
