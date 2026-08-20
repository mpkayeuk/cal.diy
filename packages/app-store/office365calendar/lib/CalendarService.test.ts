import { MSTeamsLocationType } from "@calcom/app-store/constants";
import type { CalendarServiceEvent } from "@calcom/types/Calendar";
import type { CredentialForCalendarServiceWithTenantId } from "@calcom/types/Credential";
import type { TFunction } from "i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { successResponse } from "../../_utils/testUtils";
import BuildCalendarService from "./CalendarService";

const mockRequestRaw = vi.fn();

vi.mock("../../_utils/oauth/OAuthManager", () => ({
  OAuthManager: vi.fn().mockImplementation(function () {
    return { requestRaw: mockRequestRaw };
  }),
}));

vi.mock("@calcom/lib/CalEventParser", () => ({
  getLocation: (event: { location?: string | null }) => event.location ?? "",
  getRichDescriptionHTML: () => "<p>booking notes</p>",
}));

const t = ((key: string) => key) as TFunction;

const testCredential = {
  appId: "office365-calendar",
  id: 7,
  invalid: false,
  key: {
    access_token: "token",
    token_type: "Bearer",
    expiry_date: Date.now() + 60 * 60 * 1000,
    refresh_token: "refresh",
  },
  type: "office365_calendar",
  userId: 1,
  user: { email: "mark@rzlvr.com" },
  teamId: null,
  delegatedTo: null,
  delegatedToId: null,
  delegationCredentialId: null,
  encryptedKey: null,
} as CredentialForCalendarServiceWithTenantId;

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
    location: MSTeamsLocationType,
    ...overrides,
  };
}

describe("Office365CalendarService.createEvent", () => {
  beforeEach(() => {
    mockRequestRaw.mockReset();
  });

  it("posts a Teams event with Graph attendees by default and returns the join URL", async () => {
    mockRequestRaw.mockImplementation(({ url, options }: { url: string; options: RequestInit }) => {
      if (url.endsWith("/me/calendar/events") && options.method === "POST") {
        const payload = JSON.parse(String(options.body));
        expect(payload.attendees).toEqual([
          {
            emailAddress: { address: "mark@kaye.co", name: "Booker" },
            type: "required",
          },
        ]);
        expect(payload.isOnlineMeeting).toBe(true);
        expect(payload.onlineMeetingProvider).toBe("teamsForBusiness");
        return Promise.resolve(
          successResponse({
            json: {
              id: "graph-event-id",
              iCalUId: "ical-uid",
              onlineMeeting: {
                joinUrl: "https://teams.microsoft.com/l/meetup-join/abc",
              },
            },
          })
        );
      }
      throw new Error(`Unexpected URL ${url}`);
    });

    const calendarService = BuildCalendarService(testCredential);
    const created = await calendarService.createEvent(buildCalEvent(), testCredential.id);

    expect(created.url).toBe("https://teams.microsoft.com/l/meetup-join/abc");
    expect(created.iCalUID).toBe("ical-uid");
    expect(mockRequestRaw).toHaveBeenCalled();
  });

  it("omits Graph attendees when the event type disables Outlook invitations", async () => {
    mockRequestRaw.mockImplementation(({ url, options }: { url: string; options: RequestInit }) => {
      if (url.endsWith("/me/calendar/events") && options.method === "POST") {
        const payload = JSON.parse(String(options.body));
        expect(payload.attendees).toEqual([]);
        expect(JSON.stringify(payload)).not.toContain("mark@kaye.co");
        return Promise.resolve(
          successResponse({
            json: {
              id: "graph-event-id",
              iCalUId: "ical-uid",
              onlineMeeting: {
                joinUrl: "https://teams.microsoft.com/l/meetup-join/abc",
              },
            },
          })
        );
      }
      throw new Error(`Unexpected URL ${url}`);
    });

    const calendarService = BuildCalendarService(testCredential);
    await calendarService.createEvent(
      buildCalEvent({ sendOutlookCalendarInvites: false }),
      testCredential.id
    );

    expect(mockRequestRaw).toHaveBeenCalled();
  });
});
