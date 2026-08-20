import type { CalendarEvent } from "@calcom/types/Calendar";
import type { TFunction } from "i18next";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { EmailDetailsTable } from "./EmailDetailsTable";
import { LocationInfo } from "./LocationInfo";

vi.mock("@calcom/app-store/locations", () => ({
  MSTeamsLocationType: "integrations:office365_video",
  guessEventLocationType: (location?: string) => {
    if (location === "integrations:office365_video") {
      return { label: "MS Teams (Requires work/school account)" };
    }
    if (location === "integrations:daily") {
      return { label: "Cal Video" };
    }
    return undefined;
  },
}));

vi.mock("@calcom/lib/CalEventParser", () => ({
  getVideoCallUrlFromCalEvent: (calEvent: { videoCallData?: { url?: string }; location?: string | null }) =>
    calEvent.videoCallData?.url || "",
}));

const TEAMS_URL =
  "https://teams.microsoft.com/l/meetup-join/19%3ameeting_abcdefghijklmnopqrstuvwxyz0123456789/0?context=%7b%22Tid%22%3a%22aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee%22%7d";

const t = ((key: string) =>
  key === "join_microsoft_teams_meeting" ? "Join Microsoft Teams meeting" : key) as TFunction;

function renderLocation(calEvent: CalendarEvent) {
  return renderToStaticMarkup(
    <EmailDetailsTable>
      <LocationInfo calEvent={calEvent} t={t} />
    </EmailDetailsTable>
  );
}

describe("LocationInfo", () => {
  it("renders a named Teams join link and hides the raw meeting URL", () => {
    const html = renderLocation({
      location: "integrations:office365_video",
      videoCallData: {
        type: "office365_video",
        id: "meeting-id",
        password: "",
        url: TEAMS_URL,
      },
    } as CalendarEvent);

    expect(html).toContain(`href="${TEAMS_URL}"`);
    expect(html).toContain("Join Microsoft Teams meeting");
    expect(html).not.toContain("MS Teams (Requires work/school account)");
    expect(html.replaceAll(TEAMS_URL, "")).not.toContain("teams.microsoft.com");
  });

  it("does not print a duplicate raw URL for other video meetings", () => {
    const html = renderLocation({
      location: "integrations:daily",
      videoCallData: {
        type: "daily_video",
        id: "daily-id",
        password: "",
        url: "https://app.cal.com/video/abc123",
      },
    } as CalendarEvent);

    expect(html).toContain("Cal Video");
    expect(html).not.toContain("Meeting URL:");
  });
});
