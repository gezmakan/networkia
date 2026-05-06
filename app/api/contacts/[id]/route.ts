import { auth } from "@/auth";
import {
  normalizeNextMeetCadence,
  serializeContact,
} from "@/lib/contact-response";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// GET /api/contacts/[id] - Get single contact
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const contact = await prisma.contact.findUnique({
    where: {
      id,
    },
    include: {
      interactions: true,
    },
  });

  if (!contact) {
    return Response.json({ error: "Contact not found" }, { status: 404 });
  }

  if (contact.userId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json(serializeContact(contact));
}

// PATCH /api/contacts/[id] - Update contact
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
    // Check if contact exists and user owns it
    const existingContact = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!existingContact) {
      return Response.json({ error: "Contact not found" }, { status: 404 });
    }

    if (existingContact.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      location,
      title,
      tags,
      isQuickContact,
      profileFields,
      personalNotes,
      lastContact,
      nextMeetDate,
      nextMeetCadence,
      shareToken,
      isShared,
    } = body;

    // Build update data object (only include provided fields)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (location !== undefined) updateData.location = location;
    if (title !== undefined) updateData.title = title;
    if (tags !== undefined) updateData.tags = tags;
    if (isQuickContact !== undefined) updateData.isQuickContact = isQuickContact;
    if (profileFields !== undefined) updateData.profileFields = profileFields;
    if (personalNotes !== undefined) updateData.personalNotes = personalNotes;
    if (shareToken !== undefined) updateData.shareToken = shareToken;
    if (isShared !== undefined) updateData.isShared = isShared;
    // Handle lastContact: null/empty clears it, valid date updates it, undefined skips it
    if (lastContact !== undefined) {
      if (lastContact === null || lastContact === "") {
        updateData.lastContact = null;
      } else {
        const parsedLastContact = new Date(lastContact);
        if (!isNaN(parsedLastContact.getTime())) {
          updateData.lastContact = parsedLastContact;
        } else {
          updateData.lastContact = null;
        }
      }
    }

    // Handle nextMeetDate: null/empty clears it, valid date updates it, undefined skips it
    if (nextMeetDate !== undefined) {
      if (nextMeetDate === null || nextMeetDate === "") {
        updateData.nextMeetDate = null;
      } else {
        const parsedNextMeetDate = new Date(nextMeetDate);
        if (!isNaN(parsedNextMeetDate.getTime())) {
          updateData.nextMeetDate = parsedNextMeetDate;
        } else {
          updateData.nextMeetDate = null;
        }
      }
    }
    if (nextMeetCadence !== undefined) {
      updateData.nextMeetCadence = normalizeNextMeetCadence(nextMeetCadence);
    }

    const contact = await prisma.contact.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        interactions: true,
      },
    });

    return Response.json(serializeContact(contact));
  } catch (error) {
    console.error("Error updating contact:", error);
    return Response.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id] - Delete contact
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
    // Check if contact exists and user owns it
    const existingContact = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!existingContact) {
      return Response.json({ error: "Contact not found" }, { status: 404 });
    }

    if (existingContact.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.contact.delete({
      where: {
        id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return Response.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
