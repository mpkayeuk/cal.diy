import { describe, expect, it } from "vitest";
import { isMicrosoftTeamsMeeting } from "./isMicrosoftTeamsMeeting";

describe("isMicrosoftTeamsMeeting", () => {
  it("detects the Office 365 video location type", () => {
    expect(
      isMicrosoftTeamsMeeting({
        location: "integrations:office365_video",
      })
    ).toBe(true);
  });

  it("detects the office365_video call type", () => {
    expect(
      isMicrosoftTeamsMeeting({
        videoCallType: "office365_video",
      })
    ).toBe(true);
  });

  it("detects teams.microsoft.com join URLs", () => {
    expect(
      isMicrosoftTeamsMeeting({
        meetingUrl:
          "https://teams.microsoft.com/l/meetup-join/19%3ameeting_abc123/0?context=%7b%22Tid%22%3a%22x%22%7d",
      })
    ).toBe(true);
  });

  it("detects teams.live.com URLs", () => {
    expect(
      isMicrosoftTeamsMeeting({
        location: "https://teams.live.com/meet/123456",
      })
    ).toBe(true);
  });

  it("does not treat other conferencing URLs as Teams", () => {
    expect(
      isMicrosoftTeamsMeeting({
        location: "integrations:daily",
        meetingUrl: "https://app.cal.com/video/abc",
        videoCallType: "daily_video",
      })
    ).toBe(false);
  });
});
