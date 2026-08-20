import isSmsCalEmail from "@calcom/lib/isSmsCalEmail";
import type { CalendarEvent } from "@calcom/types/Calendar";
import type { TFunction } from "i18next";
import { EMAIL_FONT, EMAIL_INK } from "../lib/emailBrand";
import { Info } from "./Info";

export const PersonInfo = ({ name = "", email = "", role = "", phoneNumber = "" }) => {
  const displayEmail = !isSmsCalEmail(email);
  const formattedPhoneNumber = phoneNumber ? `${phoneNumber} ` : "";

  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      border={0}
      style={{ width: "100%" }}>
      <tbody>
        <tr>
          <td
            style={{
              color: EMAIL_INK,
              fontWeight: 700,
              lineHeight: "24px",
              fontFamily: EMAIL_FONT,
              paddingBottom: 4,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              wordWrap: "break-word",
            }}>
            {name} - {role} {formattedPhoneNumber}
            {displayEmail ? (
              <>
                {" "}
                <a
                  href={`mailto:${email}`}
                  style={{
                    color: EMAIL_INK,
                    textDecoration: "underline",
                    fontWeight: 700,
                    wordBreak: "break-all",
                    overflowWrap: "anywhere",
                  }}>
                  {email}
                </a>
              </>
            ) : null}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export function WhoInfo(props: { calEvent: CalendarEvent; t: TFunction }) {
  const { t } = props;
  return (
    <Info
      label={t("who")}
      description={
        <>
          <PersonInfo
            name={props.calEvent.organizer.name}
            role={t("organizer")}
            email={props.calEvent.hideOrganizerEmail ? "" : props.calEvent.organizer.email}
          />
          {props.calEvent.team?.members.map((member) => (
            <PersonInfo
              key={member.name}
              name={member.name}
              role={t("team_member")}
              email={props.calEvent.hideOrganizerEmail ? "" : member?.email}
            />
          ))}
          {props.calEvent.attendees.map((attendee) => (
            <PersonInfo
              key={attendee.id || attendee.name}
              name={attendee.name}
              role={t("guest")}
              email={attendee.email}
              phoneNumber={attendee.phoneNumber ?? undefined}
            />
          ))}
        </>
      }
      withSpacer
    />
  );
}
