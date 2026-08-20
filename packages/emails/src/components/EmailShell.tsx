import { APP_NAME, LOGO_DARK, WEBAPP_URL } from "@calcom/lib/constants";

import {
  EMAIL_ACCENT,
  EMAIL_BRAND_TEXT,
  EMAIL_CARD_BG,
  EMAIL_FONT,
  EMAIL_FOOTER_BG,
  EMAIL_FOOTER_TEXT,
  EMAIL_HEADER_BG,
  EMAIL_INK,
  EMAIL_LOGO_WIDTH,
  EMAIL_MUTED,
  EMAIL_PAGE_BG,
} from "../lib/emailBrand";
import EmailHead from "./EmailHead";
import RawHtml from "./RawHtml";

const logoSrc = `${WEBAPP_URL}${LOGO_DARK}`;

export const EmailShell = (props: {
  subject: string;
  title?: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  callToAction?: React.ReactNode;
  hideLogo?: boolean;
}) => {
  const { subject, title, subtitle, children, callToAction, hideLogo } = props;
  const branded = !hideLogo;

  return (
    <>
      <RawHtml html="<!doctype html>" />
      <html lang="en-GB">
        <EmailHead title={subject} />
        <body
          style={{
            margin: 0,
            padding: 0,
            backgroundColor: EMAIL_PAGE_BG,
            color: EMAIL_INK,
            fontFamily: EMAIL_FONT,
            wordSpacing: "normal",
          }}>
          <table
            role="presentation"
            width="100%"
            cellSpacing={0}
            cellPadding={0}
            border={0}
            style={{ width: "100%", backgroundColor: EMAIL_PAGE_BG }}>
            <tbody>
              <tr>
                <td align="center" style={{ padding: "32px 14px" }}>
                  <table
                    role="presentation"
                    width="640"
                    cellSpacing={0}
                    cellPadding={0}
                    border={0}
                    style={{
                      width: "100%",
                      maxWidth: 640,
                      backgroundColor: EMAIL_CARD_BG,
                      borderRadius: 16,
                      overflow: "hidden",
                    }}>
                    <tbody>
                      {branded ? (
                        <tr>
                          <td
                            style={{
                              padding: "26px 32px",
                              backgroundColor: EMAIL_HEADER_BG,
                              borderBottom: `5px solid ${EMAIL_ACCENT}`,
                            }}>
                            <table
                              role="presentation"
                              width="100%"
                              cellSpacing={0}
                              cellPadding={0}
                              border={0}>
                              <tbody>
                                <tr>
                                  <td style={{ verticalAlign: "middle" }}>
                                    <img
                                      src={logoSrc}
                                      alt={APP_NAME}
                                      width={EMAIL_LOGO_WIDTH}
                                      style={{
                                        display: "block",
                                        width: EMAIL_LOGO_WIDTH,
                                        maxWidth: "100%",
                                        height: "auto",
                                        border: 0,
                                        outline: "none",
                                        textDecoration: "none",
                                      }}
                                    />
                                  </td>
                                  <td align="right" style={{ verticalAlign: "middle" }}>
                                    <span
                                      style={{
                                        display: "inline-block",
                                        padding: "7px 10px",
                                        backgroundColor: EMAIL_ACCENT,
                                        color: EMAIL_BRAND_TEXT,
                                        fontSize: 10,
                                        fontWeight: 900,
                                        letterSpacing: "0.10em",
                                        textTransform: "uppercase",
                                        borderRadius: 4,
                                        fontFamily: EMAIL_FONT,
                                      }}>
                                      {APP_NAME}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ) : null}
                      {title || subtitle ? (
                        <tr>
                          <td style={{ padding: "34px 32px 16px", fontFamily: EMAIL_FONT }}>
                            {title ? (
                              <h1
                                data-testid="heading"
                                style={{
                                  margin: 0,
                                  color: EMAIL_INK,
                                  fontSize: 32,
                                  lineHeight: 1.12,
                                  letterSpacing: "-0.04em",
                                  fontFamily: EMAIL_FONT,
                                  fontWeight: 700,
                                }}>
                                {title}
                              </h1>
                            ) : null}
                            {subtitle ? (
                              <div
                                data-testid="subHeading"
                                style={{
                                  margin: title ? "12px 0 0" : 0,
                                  color: EMAIL_MUTED,
                                  fontSize: 14,
                                  lineHeight: 1.5,
                                  fontFamily: EMAIL_FONT,
                                }}>
                                {subtitle}
                              </div>
                            ) : null}
                          </td>
                        </tr>
                      ) : null}
                      <tr>
                        <td
                          style={{
                            padding: title || subtitle ? "10px 32px 8px" : "34px 32px 8px",
                            fontFamily: EMAIL_FONT,
                            fontSize: 16,
                            color: EMAIL_INK,
                            fontWeight: 500,
                            textAlign: "left",
                            lineHeight: 1.5,
                          }}>
                          {children}
                        </td>
                      </tr>
                      {callToAction ? (
                        <tr>
                          <td style={{ padding: "18px 32px 36px", fontFamily: EMAIL_FONT }}>{callToAction}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td style={{ paddingBottom: 28 }} />
                        </tr>
                      )}
                      {branded ? (
                        <tr>
                          <td
                            style={{
                              padding: "18px 32px",
                              backgroundColor: EMAIL_FOOTER_BG,
                              color: EMAIL_FOOTER_TEXT,
                              fontSize: 11,
                              lineHeight: 1.5,
                              fontFamily: EMAIL_FONT,
                            }}>
                            Sent from {APP_NAME}.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    </>
  );
};
