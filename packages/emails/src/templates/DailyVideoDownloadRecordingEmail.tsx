import { APP_NAME, COMPANY_NAME, POWERED_BY_URL } from "@calcom/lib/constants";
import type { TFunction } from "i18next";
import { EMAIL_BRAND, EMAIL_CALLOUT_BG, EMAIL_INK } from "../lib/emailBrand";
import { CallToAction, V2BaseEmailHtml } from "../components";

interface DailyVideoDownloadRecordingEmailProps {
  language: TFunction;
  downloadLink: string;
  title: string;
  date: string;
  name: string;
}

export const DailyVideoDownloadRecordingEmail = (
  props: DailyVideoDownloadRecordingEmailProps & Partial<React.ComponentProps<typeof V2BaseEmailHtml>>
) => {
  return (
    <V2BaseEmailHtml
      subject={props.language("download_your_recording", {
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
        <>{props.language("download_your_recording")}</>
      </p>
      <p style={{ fontWeight: 400, lineHeight: "24px" }}>
        <>{props.language("hi_user_name", { name: props.name })},</>
      </p>
      <p style={{ fontWeight: 400, lineHeight: "24px", marginBottom: "40px" }}>
        <>{props.language("recording_from_your_recent_call", { appName: APP_NAME })}</>
      </p>

      <div
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
          {props.date}
        </p>
        <CallToAction label={props.language("download_recording")} href={props.downloadLink} />
      </div>

      <p style={{ fontWeight: 500, lineHeight: "20px", marginTop: "8px" }}>
        {props.language("link_valid_for_12_hrs_description")}{" "}
        <a href={POWERED_BY_URL} style={{ color: EMAIL_BRAND }}>
          {props.language("here")}
        </a>
      </p>

      <p style={{ fontWeight: 400, lineHeight: "24px", marginTop: "32px", marginBottom: "8px" }}>
        <>{props.language("happy_scheduling")},</>
      </p>
      <p style={{ fontWeight: 400, lineHeight: "24px", marginTop: "0px" }}>
        <>{props.language("the_calcom_team", { companyName: COMPANY_NAME })}</>
      </p>
    </V2BaseEmailHtml>
  );
};
