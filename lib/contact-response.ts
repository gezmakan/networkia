import type { Contact, Interaction, NextMeetCadence } from "@prisma/client";

type ContactWithInteractions = Contact & { interactions?: Interaction[] };

export function normalizeNextMeetCadence(
  value: unknown
): NextMeetCadence | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string") return null;
  switch (value.trim().toLowerCase()) {
    case "weekly":
      return "WEEKLY";
    case "biweekly":
      return "BIWEEKLY";
    case "monthly":
      return "MONTHLY";
    case "quarterly":
      return "QUARTERLY";
    default:
      return null;
  }
}

export function serializeContact(contact: ContactWithInteractions) {
  const { interactions, ...rest } = contact;
  return {
    ...rest,
    nextMeetCadence: rest.nextMeetCadence
      ? rest.nextMeetCadence.toLowerCase()
      : null,
    interactionNotes: (interactions ?? []).map((i) => ({
      id: i.id,
      title: i.title,
      body: i.body,
      date: i.date.toISOString(),
    })),
  };
}
