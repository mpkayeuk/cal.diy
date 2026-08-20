import type { TFunction } from "i18next";
import type { EventStatus } from "ics";

import type { CalendarEvent } from "@calcom/types/Calendar";

import generateIcsString from "./generateIcsString";

export enum GenerateIcsRole {
  ATTENDEE = "attendee",
  ORGANIZER = "organizer",
}

/** Booking emails no longer attach ICS; they use add-to-calendar links in When instead. */
export default function generateIcsFile({
  calEvent,
  role,
  status,
  t,
}: {
  calEvent: CalendarEvent;
  role: GenerateIcsRole;
  status: EventStatus;
  t?: TFunction;
}) {
  // O365 deletes emails if the calendar event is selected. Currently no option to disable this on the web
  if (
    role !== GenerateIcsRole.ATTENDEE &&
    calEvent.destinationCalendar &&
    calEvent.destinationCalendar[0]?.integration === "office365_calendar"
  )
    return null;

  return {
    filename: "event.ics",
    content: generateIcsString({
      event: calEvent,
      status,
      t,
    }),
    method: status === "CANCELLED" ? "CANCEL" : "REQUEST",
  };
}
