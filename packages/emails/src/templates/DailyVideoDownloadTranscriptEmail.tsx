import { COMPANY_NAME } from "@calcom/lib/constants";
import type { TFunction } from "i18next";
import { EMAIL_CALLOUT_BG, EMAIL_INK } from "../lib/emailBrand";
import { V2BaseEmailHtml } from "../components";

interface DailyVideoDownloadTranscriptEmailProps {
  language: TFunction;
  transcriptDownloadLinks: Array<string>;
  title: string;
  date: string;
  name: string;
}

export const DailyVideoDownloadTranscriptEmail = (
  props: DailyVideoDownloadTranscriptEmailProps & Partial<React.ComponentProps<typeof V2BaseEmailHtml>>
) => {
  return (
    <V2BaseEmailHtml
      subject={props.language("download_transcript_email_subject", {
        title: props.title,
        date: props.date,
      })}>
      <p
        style={{
          fontSize: "32px",
          fontWeight: "600",
          lineHeight: "38.5px",
          marginBottom: "40px",
          color: EMAIL_INK,
        }}>
        <>{props.language("download_your_transcripts")}</>
      </p>
      <p style={{ fontWeight: 400, lineHeight: "24px" }}>
        <>{props.language("hi_user_name", { name: props.name })},</>
      </p>
      <p style={{ fontWeight: 400, lineHeight: "24px", marginBottom: "40px" }}>
        <>{props.language("you_can_download_transcript_from_attachments")}</>
      </p>

      {props.transcriptDownloadLinks.map((_, index) => {
        return (
          <div
            key={`transcript-${index}`}
            style={{
              backgroundColor: EMAIL_CALLOUT_BG,
              padding: "32px",
              marginBottom: "40px",
            }}>
            <p
              style={{
                fontSize: "18px",
                lineHeight: "20px",
                fontWeight: 600,
                marginBottom: "8px",
                color: EMAIL_INK,
              }}>
              <>{props.title}</>
            </p>
            <p
              style={{
                fontWeight: 400,
                lineHeight: "24px",
                marginBottom: "24px",
                marginTop: "0px",
                color: EMAIL_INK,
              }}>
              {props.date} Transcript {index + 1}
            </p>
          </div>
        );
      })}

      <p style={{ fontWeight: 400, lineHeight: "24px", marginTop: "32px", marginBottom: "8px" }}>
        <>{props.language("happy_scheduling")},</>
      </p>
      <p style={{ fontWeight: 400, lineHeight: "24px", marginTop: "0px" }}>
        <>{props.language("the_calcom_team", { companyName: COMPANY_NAME })}</>
      </p>
    </V2BaseEmailHtml>
  );
};
