import { EMAIL_CARD_BG, EMAIL_CTA_BG, EMAIL_CTA_TEXT, EMAIL_FONT, EMAIL_INK } from "../lib/emailBrand";
import { CallToActionIcon } from "./CallToActionIcon";

export const CallToAction = (props: {
  label: string;
  href?: string;
  secondary?: boolean;
  startIconName?: string;
  endIconName?: string;
}) => {
  const { label, href, secondary, startIconName, endIconName } = props;
  const El = href ? "a" : "button";
  const restProps = href ? { href, target: "_blank" as const } : { type: "submit" as const };
  const background = secondary ? EMAIL_CARD_BG : EMAIL_CTA_BG;

  return (
    <table role="presentation" cellSpacing={0} cellPadding={0} border={0}>
      <tbody>
        <tr>
          <td
            style={{
              background,
              border: `2px solid ${EMAIL_INK}`,
              borderRadius: 8,
              boxShadow: `3px 3px 0 ${EMAIL_INK}`,
            }}>
            <El
              style={{
                display: "inline-block",
                padding: "13px 20px",
                color: EMAIL_CTA_TEXT,
                fontSize: 15,
                fontWeight: 900,
                lineHeight: 1.2,
                textDecoration: "none",
                fontFamily: EMAIL_FONT,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              {...restProps}
              {...(href ? { rel: "noreferrer" } : {})}>
              {startIconName ? (
                <CallToActionIcon
                  style={{ marginRight: "0.5rem", marginLeft: 0, verticalAlign: "middle" }}
                  iconName={startIconName}
                />
              ) : null}
              {label}
              {endIconName ? (
                <CallToActionIcon
                  style={{ verticalAlign: "middle" }}
                  iconName={endIconName}
                />
              ) : null}
            </El>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
