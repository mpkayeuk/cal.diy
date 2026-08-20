import { MSTeamsLocationType } from "@calcom/app-store/locations";

const TEAMS_URL_RE = /https?:\/\/(?:[a-z0-9-]+\.)*(?:teams\.microsoft\.com|teams\.live\.com)\b/i;

export function isMicrosoftTeamsMeeting({
  location,
  meetingUrl,
  videoCallType,
}: {
  location?: string | null;
  meetingUrl?: string | null;
  videoCallType?: string | null;
}): boolean {
  if (videoCallType === "office365_video") {
    return true;
  }
  if (location === MSTeamsLocationType) {
    return true;
  }
  return TEAMS_URL_RE.test(`${location ?? ""}\n${meetingUrl ?? ""}`);
}
