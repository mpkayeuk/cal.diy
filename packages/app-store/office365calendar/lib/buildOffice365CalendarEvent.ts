import { MSTeamsLocationType } from "@calcom/app-store/constants";
import dayjs from "@calcom/dayjs";
import { getLocation, getRichDescriptionHTML } from "@calcom/lib/CalEventParser";
import type { CalendarServiceEvent } from "@calcom/types/Calendar";
import type { Event } from "@microsoft/microsoft-graph-types-beta";

export type Office365GraphAttendee = NonNullable<Event["attendees"]>[number];

/**
 * Historical Graph attendee mapping. Exchange treats a non-empty `attendees` list as a
 * meeting request and emails every address. Cal.com already sends booking emails, so the
 * organiser calendar write does not use this unless the event type enables
 * `sendOutlookCalendarInvites`.
 */
export function mapCalEventAttendeesToGraph(
  event: CalendarServiceEvent,
  credentialUserEmail?: string
): Office365GraphAttendee[] {
  const bookingAttendees = event.attendees.map((attendee) => ({
    emailAddress: {
      address: attendee.email,
      name: attendee.name,
    },
    type: "required" as const,
  }));

  const teamAttendees = (event.team?.members ?? [])
    .filter((member) => member.email !== credentialUserEmail)
    .map((member) => {
      const destinationCalendar = event.destinationCalendar?.find(
        (cal) => cal.integration === "office365_calendar" && cal.userId === member.id
      );
      return {
        emailAddress: {
          address: destinationCalendar?.externalId ?? member.email,
          name: member.name,
        },
        type: "required" as const,
      };
    });

  return [...bookingAttendees, ...teamAttendees];
}

export function buildOffice365CalendarEvent(
  event: CalendarServiceEvent,
  {
    rescheduledEvent,
    credentialUserEmail,
    includeAttendees = false,
    isUpdate = false,
  }: {
    rescheduledEvent?: Event;
    credentialUserEmail?: string;
    includeAttendees?: boolean;
    isUpdate?: boolean;
  } = {}
): Event {
  const isOnlineMeeting = event.location === MSTeamsLocationType;
  const isRescheduledOnlineMeeting = rescheduledEvent ? rescheduledEvent.isOnlineMeeting : false;
  const existingBody =
    rescheduledEvent?.body?.contentType === "html" ? rescheduledEvent.body.content : undefined;

  let content = "";
  if (isOnlineMeeting) {
    if (isRescheduledOnlineMeeting && existingBody) {
      content = `
        ${getRichDescriptionHTML(event)}<hr>
        ${existingBody}`.trim();
    } else {
      content = getRichDescriptionHTML(event);
    }
  } else {
    content = event.calendarDescription;
  }

  const office365Event: Event = {
    subject: event.title,
    body: {
      contentType: isOnlineMeeting ? "html" : "text",
      content,
    },
    start: {
      dateTime: dayjs(event.startTime).tz(event.organizer.timeZone).format("YYYY-MM-DDTHH:mm:ss"),
      timeZone: event.organizer.timeZone,
    },
    end: {
      dateTime: dayjs(event.endTime).tz(event.organizer.timeZone).format("YYYY-MM-DDTHH:mm:ss"),
      timeZone: event.organizer.timeZone,
    },
  };

  if (includeAttendees) {
    office365Event.attendees = mapCalEventAttendeesToGraph(event, credentialUserEmail);
    office365Event.hideAttendees = !event.seatsPerTimeSlot ? false : !event.seatsShowAttendees;
  } else if (!isUpdate) {
    office365Event.attendees = [];
  }

  if (event.hideCalendarEventDetails) {
    office365Event.sensitivity = "private";
  }
  if (isOnlineMeeting) {
    office365Event.isOnlineMeeting = true;
    office365Event.allowNewTimeProposals = true;
    office365Event.onlineMeetingProvider = "teamsForBusiness";
    office365Event.location =
      rescheduledEvent && !isRescheduledOnlineMeeting
        ? { displayName: "Microsoft Teams Meeting" }
        : undefined;
  } else {
    office365Event.location = event.location ? { displayName: getLocation(event) } : undefined;
  }
  return office365Event;
}
