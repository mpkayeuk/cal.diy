import { guessEventLocationType } from "@calcom/app-store/locations";
import { getVideoCallUrlFromCalEvent } from "@calcom/lib/CalEventParser";
import type { CalendarEvent } from "@calcom/types/Calendar";
import type { TFunction } from "i18next";
import { EMAIL_INK, EMAIL_MUTED } from "../lib/emailBrand";
import { isMicrosoftTeamsMeeting } from "../lib/isMicrosoftTeamsMeeting";
import { Info } from "./Info";

const LINK_STYLES = {
  color: EMAIL_INK,
  textDecoration: "underline",
  fontWeight: 800,
  wordBreak: "break-word",
  overflowWrap: "anywhere",
  wordWrap: "break-word",
} as const;

export function LocationInfo(props: { calEvent: CalendarEvent; t: TFunction }): JSX.Element | null {
  const { t } = props;
  const providerName = guessEventLocationType(props.calEvent.location)?.label;
  const location = props.calEvent.location;
  let meetingUrl = location?.search(/^https?:/) !== -1 ? location : undefined;

  if (props.calEvent) {
    meetingUrl = getVideoCallUrlFromCalEvent(props.calEvent) || meetingUrl;
  }

  const isPhone = location?.startsWith("+");
  const isTeams = isMicrosoftTeamsMeeting({
    location,
    meetingUrl,
    videoCallType: props.calEvent.videoCallData?.type,
  });

  if (meetingUrl) {
    const linkLabel = isTeams ? t("join_microsoft_teams_meeting") : providerName || meetingUrl;

    return (
      <Info
        label={t("where")}
        withSpacer
        description={
          <a
            href={meetingUrl}
            target="_blank"
            title={isTeams ? t("join_microsoft_teams_meeting") : t("meeting_url")}
            style={LINK_STYLES}
            rel="noreferrer">
            {linkLabel}
          </a>
        }
      />
    );
  }

  if (isPhone) {
    return (
      <Info
        label={t("where")}
        withSpacer
        description={
          <a href={`tel:${location}`} title="Phone" style={LINK_STYLES}>
            {location}
          </a>
        }
      />
    );
  }

  return (
    <Info
      label={t("where")}
      withSpacer
      description={providerName || location}
      extraInfo={
        (providerName === "Zoom" || providerName === "Google") && props.calEvent.requiresConfirmation ? (
          <span style={{ color: EMAIL_MUTED, fontWeight: 400, lineHeight: "24px" }}>
            {t("meeting_url_provided_after_confirmed")}
          </span>
        ) : null
      }
    />
  );
}
