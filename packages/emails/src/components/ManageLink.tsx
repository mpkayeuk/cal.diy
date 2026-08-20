import { getBookingUrl, getCancelLink, getRescheduleLink } from "@calcom/lib/CalEventParser";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";

import { EMAIL_FONT, EMAIL_INK } from "../lib/emailBrand";

export function ManageLink(props: { calEvent: CalendarEvent; attendee: Person }) {
  // Only the original attendee can make changes to the event
  // Guests cannot
  const t = props.attendee.language.translate;
  const cancelLink = getCancelLink(
    {
      platformClientId: props.calEvent.platformClientId,
      platformCancelUrl: props.calEvent.platformCancelUrl,
      type: props.calEvent.type,
      organizer: props.calEvent.organizer,
      recurringEvent: props.calEvent.recurringEvent,
      bookerUrl: props.calEvent.bookerUrl,
      uid: props.calEvent.uid,
      attendeeSeatId: props.calEvent.attendeeSeatId,
      team: props.calEvent.team,
    },
    props.attendee
  );
  const rescheduleLink = getRescheduleLink({ calEvent: props.calEvent, attendee: props.attendee });
  const bookingLink = getBookingUrl({
    platformClientId: props.calEvent.platformClientId,
    platformBookingUrl: props.calEvent.platformBookingUrl,
    bookerUrl: props.calEvent.bookerUrl,
    type: props.calEvent.type,
    uid: props.calEvent.uid,
    organizer: props.calEvent.organizer,
    attendeeSeatId: props.calEvent.attendeeSeatId,
  });

  const isOriginalAttendee = props.attendee.email === props.calEvent.attendees[0]?.email;
  const isOrganizer = props.calEvent.organizer.email === props.attendee.email;
  const hasCancelLink = Boolean(cancelLink) && !props.calEvent.disableCancelling;
  const hasRescheduleLink = Boolean(rescheduleLink) && !props.calEvent.disableRescheduling;
  const hasBookingLink = Boolean(bookingLink);
  const isRecurringEvent = props.calEvent.recurringEvent;
  const shouldDisplayRescheduleLink = Boolean(hasRescheduleLink && !isRecurringEvent);
  const isTeamMember = props.calEvent.team?.members.some((member) => props.attendee.email === member.email);

  if (
    (isOriginalAttendee || isOrganizer || isTeamMember) &&
    (hasCancelLink || (!isRecurringEvent && hasRescheduleLink) || hasBookingLink)
  ) {
    return (
      <div
        style={{
          fontFamily: EMAIL_FONT,
          fontSize: "16px",
          fontWeight: 500,
          lineHeight: "0px",
          textAlign: "left",
          color: EMAIL_INK,
        }}>
        <p
          style={{
            fontWeight: 400,
            lineHeight: "24px",
            textAlign: "left",
            width: "100%",
            fontFamily: EMAIL_FONT,
          }}>
          {(shouldDisplayRescheduleLink || hasCancelLink) && <>{t("need_to_make_a_change")}</>}
          {shouldDisplayRescheduleLink && (
            <span>
              <a
                href={rescheduleLink}
                style={{
                  color: EMAIL_INK,
                  marginLeft: "5px",
                  marginRight: "5px",
                  textDecoration: "underline",
                  fontWeight: 800,
                }}>
                <>{t("reschedule")}</>
              </a>
              {hasCancelLink && <>{t("or_lowercase")}</>}
            </span>
          )}
          {hasCancelLink && (
            <span>
              <a
                href={cancelLink}
                style={{
                  color: EMAIL_INK,
                  marginLeft: "5px",
                  textDecoration: "underline",
                  fontWeight: 800,
                }}>
                <>{t("cancel")}</>
              </a>
            </span>
          )}

          {props.calEvent.platformClientId && hasBookingLink && (
            <span>
              {(hasCancelLink || shouldDisplayRescheduleLink) && (
                <span
                  style={{
                    marginLeft: "5px",
                  }}>
                  {t("or_lowercase")}
                </span>
              )}
              <a
                href={bookingLink}
                style={{
                  color: EMAIL_INK,
                  marginLeft: "5px",
                  textDecoration: "underline",
                  fontWeight: 800,
                }}>
                <>{t("check_here")}</>
              </a>
            </span>
          )}
        </p>
      </div>
    );
  }

  // Don't have the rights to the manage link
  return null;
}
