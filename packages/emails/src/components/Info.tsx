import { markdownToSafeHTML } from "@calcom/lib/markdownToSafeHTML";
import { EMAIL_FONT, EMAIL_INK, EMAIL_LINE, EMAIL_MUTED } from "../lib/emailBrand";
import { EMAIL_DETAILS_LABEL_WIDTH_PX } from "./EmailDetailsTable";

const WRAP_STYLES = {
  wordBreak: "break-word",
  overflowWrap: "anywhere",
  wordWrap: "break-word",
} as const;

export const Info = (props: {
  label: string;
  description: React.ReactNode | undefined | null;
  extraInfo?: React.ReactNode;
  withSpacer?: boolean;
  lineThrough?: boolean;
  formatted?: boolean;
  isLabelHTML?: boolean;
}): JSX.Element | null => {
  if (!props.description || props.description === "") return null;

  const safeDescription = markdownToSafeHTML(props.description.toString()) || "";
  const safeLabel = markdownToSafeHTML(props.label.toString());

  const StyledHtmlContent = ({ htmlContent }: { htmlContent: string }) => {
    const css = `color: ${EMAIL_INK}; font-weight: 400; line-height: 1.55; margin: 0; font-family: ${EMAIL_FONT}; word-break: break-word; overflow-wrap: anywhere;`;
    return (
      <p
        className="dark:text-darkgray-600 mt-2 text-sm text-gray-500 [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-600"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized via markdownToSafeHTML
        dangerouslySetInnerHTML={{
          __html: htmlContent
            .replaceAll("<p>", `<p style="${css}">`)
            .replaceAll("<li>", `<li style="${css}">`)
            .replaceAll(
              "<a ",
              `<a style="color: ${EMAIL_INK}; text-decoration: underline; word-break: break-all; overflow-wrap: anywhere;" `
            ),
        }}
      />
    );
  };

  const labelContent = props.isLabelHTML ? <StyledHtmlContent htmlContent={safeLabel} /> : props.label;

  return (
    <tr>
      <td
        className="email-details-label"
        width={EMAIL_DETAILS_LABEL_WIDTH_PX}
        valign="top"
        style={{
          width: EMAIL_DETAILS_LABEL_WIDTH_PX,
          maxWidth: EMAIL_DETAILS_LABEL_WIDTH_PX,
          minWidth: EMAIL_DETAILS_LABEL_WIDTH_PX,
          padding: props.withSpacer ? "12px 16px 16px 0" : "12px 16px 12px 0",
          borderBottom: `1px solid ${EMAIL_LINE}`,
          verticalAlign: "top",
        }}>
        <table
          role="presentation"
          width={EMAIL_DETAILS_LABEL_WIDTH_PX}
          cellPadding={0}
          cellSpacing={0}
          border={0}
          style={{ width: EMAIL_DETAILS_LABEL_WIDTH_PX, maxWidth: EMAIL_DETAILS_LABEL_WIDTH_PX }}>
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
                  ...WRAP_STYLES,
                }}>
                {labelContent}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
      <td
        className="email-details-value"
        valign="top"
        style={{
          width: "auto",
          padding: props.withSpacer ? "12px 0 16px" : "12px 0",
          borderBottom: `1px solid ${EMAIL_LINE}`,
          verticalAlign: "top",
        }}>
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          border={0}
          style={{ width: "100%", tableLayout: "fixed" }}>
          <tbody>
            <tr>
              <td
                style={{
                  color: EMAIL_INK,
                  fontSize: 16,
                  fontWeight: props.formatted ? 400 : 700,
                  lineHeight: 1.45,
                  fontFamily: EMAIL_FONT,
                  textDecoration: props.lineThrough ? "line-through" : undefined,
                  whiteSpace: props.formatted ? undefined : "pre-wrap",
                  ...WRAP_STYLES,
                }}>
                {props.formatted ? <StyledHtmlContent htmlContent={safeDescription} /> : props.description}
              </td>
            </tr>
            {props.extraInfo ? (
              <tr>
                <td
                  style={{
                    paddingTop: 4,
                    color: EMAIL_MUTED,
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.45,
                    fontFamily: EMAIL_FONT,
                    ...WRAP_STYLES,
                  }}>
                  {props.extraInfo}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </td>
    </tr>
  );
};
