import dayjs from "@calcom/dayjs";
import type { TFunction } from "i18next";
import { RRule } from "rrule";
// TODO: Use browser locale, implement Intl in Dayjs maybe?
import "@calcom/dayjs/locales";
import { CalendarLinkType, getCalendarLinkList } from "@calcom/features/bookings/lib/getCalendarLinks";
import { getVideoCallUrlFromCalEvent } from "@calcom/lib/CalEventParser";
import { getEveryFreqFor } from "@calcom/lib/recurringStrings";
import type { TimeFormat } from "@calcom/lib/timeFormat";
import type { CalendarEvent, Person, RecurringEvent } from "@calcom/types/Calendar";
import { EMAIL_FONT, EMAIL_INK, EMAIL_MUTED } from "../lib/emailBrand";
import { Info } from "./Info";

const EMAIL_CALENDAR_LABELS: Partial<Record<CalendarLinkType, string>> = {
  [CalendarLinkType.GOOGLE_CALENDAR]: "Google Calendar",
  [CalendarLinkType.MICROSOFT_OUTLOOK]: "Outlook",
  [CalendarLinkType.MICROSOFT_OFFICE]: "Office 365",
};

function AddToCalendarLinks({ calEvent, t }: { calEvent: CalendarEvent; t: TFunction }): JSX.Element {
  const bookingLocation = getVideoCallUrlFromCalEvent(calEvent) || null;
  const calendarLinks = getCalendarLinkList({
    startTime: dayjs(calEvent.startTime),
    endTime: dayjs(calEvent.endTime),
    eventName: calEvent.title,
    eventDescription: calEvent.description ?? null,
    bookingLocation,
    recurringEvent: calEvent.recurringEvent,
    // data: URIs are stripped or bloated by mail clients; ICS stays on the confirmation page.
    includeIcs: false,
  });

  return (
    <table role="presentation" cellPadding={0} cellSpacing={0} border={0} data-testid="add-to-calendar">
      <tbody>
        <tr>
          <td
            style={{
              color: EMAIL_MUTED,
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1.45,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontFamily: EMAIL_FONT,
              paddingTop: 8,
              paddingBottom: 6,
            }}>
            {t("add_to_calendar")}
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontFamily: EMAIL_FONT,
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1.45,
            }}>
            {calendarLinks.map((item, index) => (
              <span key={item.id}>
                {index > 0 && <span style={{ color: EMAIL_MUTED }}>{` \u00b7 `}</span>}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: EMAIL_INK,
                    textDecoration: "underline",
                    fontWeight: 700,
                    fontFamily: EMAIL_FONT,
                  }}>
                  {EMAIL_CALENDAR_LABELS[item.id] ?? item.label}
                </a>
              </span>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function getRecurringWhen({
  recurringEvent,
  attendee,
}: {
  recurringEvent?: RecurringEvent | null;
  attendee: Pick<Person, "language">;
}): string {
  if (recurringEvent) {
    const t = attendee.language.translate;
    const rruleOptions = new RRule(recurringEvent).options;
    const recurringEventConfig: RecurringEvent = {
      freq: rruleOptions.freq,
      count: rruleOptions.count || 1,
      interval: rruleOptions.interval,
    };
    return `${getEveryFreqFor({ t, recurringEvent: recurringEventConfig })}`;
  }
  return "";
}

export function WhenInfo(props: {
  calEvent: CalendarEvent;
  timeZone: string;
  t: TFunction;
  locale: string;
  timeFormat: TimeFormat;
  showAddToCalendar?: boolean;
}): JSX.Element {
  const { timeZone, t, calEvent: { recurringEvent } = {}, locale, timeFormat } = props;

  function getRecipientStart(format: string) {
    return dayjs(props.calEvent.startTime).tz(timeZone).locale(locale).format(format);
  }

  function getRecipientEnd(format: string) {
    return dayjs(props.calEvent.endTime).tz(timeZone).locale(locale).format(format);
  }

  const recurringInfo = getRecurringWhen({
    recurringEvent: props.calEvent.recurringEvent,
    attendee: props.calEvent.attendees[0],
  });

  const isCancelledMeeting =
    !!props.calEvent.cancellationReason && !props.calEvent.cancellationReason.includes("$RCH$");
  const showAddToCalendar = props.showAddToCalendar !== false && !isCancelledMeeting;

  return (
    <Info
      label={`${t("when")} ${recurringInfo !== "" ? ` - ${recurringInfo}` : ""}`}
      lineThrough={isCancelledMeeting}
      description={
        <span data-testid="when">
          {recurringEvent?.count ? `${t("starting")} ` : ""}
          {getRecipientStart(`dddd, LL | ${timeFormat}`)} - {getRecipientEnd(timeFormat)}{" "}
          <span style={{ color: EMAIL_MUTED }}>({timeZone})</span>
        </span>
      }
      extraInfo={showAddToCalendar ? <AddToCalendarLinks calEvent={props.calEvent} t={t} /> : undefined}
      withSpacer
    />
  );
}
