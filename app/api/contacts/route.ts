import { auth } from "@/auth";
import {
  normalizeNextMeetCadence,
  serializeContact,
} from "@/lib/contact-response";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

function generateSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const shortId = Math.random().toString(36).substring(2, 8);
  return `${slug}-${shortId}`;
}

function generateInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// GET /api/contacts - List all user's contacts
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contacts = await prisma.contact.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { interactions: true },
  });

  return Response.json(contacts.map(serializeContact));
}

// POST /api/contacts - Create new contact
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      location = "",
      title,
      tags = [],
      isQuickContact = false,
      profileFields,
      personalNotes,
      lastContact,
      nextMeetDate,
      nextMeetCadence,
    } = body;

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = generateSlug(name);
    const initials = generateInitials(name);

    const contact = await prisma.contact.create({
      data: {
        userId: session.user.id,
        name,
        email,
        phone,
        company,
        location,
        title,
        slug,
        initials,
        tags,
        isQuickContact,
        profileFields: profileFields || undefined,
        personalNotes,
        lastContact: lastContact ? new Date(lastContact) : null,
        nextMeetDate: nextMeetDate ? new Date(nextMeetDate) : null,
        nextMeetCadence: normalizeNextMeetCadence(nextMeetCadence),
      },
    });

    return Response.json(serializeContact(contact), { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return Response.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
