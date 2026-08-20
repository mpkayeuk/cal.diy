import { MSTeamsLocationType } from "@calcom/app-store/constants";
import type { CalendarServiceEvent } from "@calcom/types/Calendar";
import type { TFunction } from "i18next";
import { describe, expect, it, vi } from "vitest";
import { buildOffice365CalendarEvent, mapCalEventAttendeesToGraph } from "./buildOffice365CalendarEvent";

vi.mock("@calcom/lib/CalEventParser", () => ({
  getLocation: (event: { location?: string | null }) => event.location ?? "",
  getRichDescriptionHTML: () => "<p>booking notes</p>",
}));

const t = ((key: string) => key) as TFunction;

function buildCalEvent(overrides: Partial<CalendarServiceEvent> = {}): CalendarServiceEvent {
  return {
    type: "intro",
    title: "Intro call",
    startTime: "2026-08-21T10:00:00Z",
    endTime: "2026-08-21T10:30:00Z",
    calendarDescription: "Plain calendar notes",
    organizer: {
      id: 1,
      name: "Mark",
      email: "mark@rzlvr.com",
      timeZone: "UTC",
      language: { translate: t, locale: "en" },
    },
    attendees: [
      {
        name: "Booker",
        email: "mark@kaye.co",
        timeZone: "Europe/London",
        language: { translate: t, locale: "en" },
      },
    ],
    location: "Office",
    ...overrides,
  };
}

describe("mapCalEventAttendeesToGraph", () => {
  it("maps booking attendees and other team members when Exchange invites are opted in", () => {
    const event = buildCalEvent({
      team: {
        id: 9,
        name: "RZLVR",
        members: [
          {
            id: 1,
            name: "Mark",
            email: "mark@rzlvr.com",
            timeZone: "UTC",
            language: { translate: t, locale: "en" },
          },
          {
            id: 2,
            name: "Colleague",
            email: "colleague@rzlvr.com",
            timeZone: "UTC",
            language: { translate: t, locale: "en" },
          },
        ],
      },
    });

    expect(mapCalEventAttendeesToGraph(event, "mark@rzlvr.com")).toEqual([
      {
        emailAddress: { address: "mark@kaye.co", name: "Booker" },
        type: "required",
      },
      {
        emailAddress: { address: "colleague@rzlvr.com", name: "Colleague" },
        type: "required",
      },
    ]);
  });
});

describe("buildOffice365CalendarEvent", () => {
  it("creates the organiser calendar event with no Graph attendees", () => {
    const payload = buildOffice365CalendarEvent(buildCalEvent());

    expect(payload.attendees).toEqual([]);
    expect(payload.organizer).toBeUndefined();
    expect(JSON.stringify(payload)).not.toContain("mark@kaye.co");
    expect(payload.subject).toBe("Intro call");
    expect(payload.location).toEqual({ displayName: "Office" });
    expect(payload.isOnlineMeeting).toBeUndefined();
  });

  it("still creates a Teams online meeting without attendees", () => {
    const payload = buildOffice365CalendarEvent(
      buildCalEvent({
        location: MSTeamsLocationType,
      })
    );

    expect(payload.attendees).toEqual([]);
    expect(payload.isOnlineMeeting).toBe(true);
    expect(payload.onlineMeetingProvider).toBe("teamsForBusiness");
    expect(payload.body?.contentType).toBe("html");
    expect(payload.body?.content).toBe("<p>booking notes</p>");
    expect(payload.location).toBeUndefined();
  });

  it("can still include attendees when Exchange invitations are explicitly requested", () => {
    const payload = buildOffice365CalendarEvent(buildCalEvent(), { includeAttendees: true });

    expect(payload.attendees).toEqual([
      {
        emailAddress: { address: "mark@kaye.co", name: "Booker" },
        type: "required",
      },
    ]);
    expect(payload.hideAttendees).toBe(false);
  });

  it("omits attendees on update so Graph does not send cancellation mail", () => {
    const payload = buildOffice365CalendarEvent(
      buildCalEvent({ location: MSTeamsLocationType }),
      { isUpdate: true }
    );

    expect(payload).not.toHaveProperty("attendees");
    expect(payload.isOnlineMeeting).toBe(true);
  });
});
