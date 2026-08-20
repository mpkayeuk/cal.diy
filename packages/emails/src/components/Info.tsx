import { markdownToSafeHTML } from "@calcom/lib/markdownToSafeHTML";

import { EMAIL_FONT, EMAIL_INK, EMAIL_LINE, EMAIL_MUTED } from "../lib/emailBrand";

export const Info = (props: {
  label: string;
  description: React.ReactNode | undefined | null;
  extraInfo?: React.ReactNode;
  withSpacer?: boolean;
  lineThrough?: boolean;
  formatted?: boolean;
  isLabelHTML?: boolean;
}) => {
  if (!props.description || props.description === "") return null;

  const safeDescription = markdownToSafeHTML(props.description.toString()) || "";
  const safeLabel = markdownToSafeHTML(props.label.toString());

  const StyledHtmlContent = ({ htmlContent }: { htmlContent: string }) => {
    const css = `color: ${EMAIL_INK}; font-weight: 400; line-height: 1.55; margin: 0; font-family: ${EMAIL_FONT};`;
    return (
      <p
        className="dark:text-darkgray-600 mt-2 text-sm text-gray-500 [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-600"
        // eslint-disable-next-line react/no-danger
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized via markdownToSafeHTML
        dangerouslySetInnerHTML={{
          __html: htmlContent
            .replaceAll("<p>", `<p style="${css}">`)
            .replaceAll("<li>", `<li style="${css}">`)
            .replaceAll("<a ", `<a style="color: ${EMAIL_INK}; text-decoration: underline;" `),
        }}
      />
    );
  };

  return (
    <table
      role="presentation"
      width="100%"
      cellSpacing={0}
      cellPadding={0}
      border={0}
      style={{ width: "100%", margin: props.withSpacer ? "0 0 4px" : 0 }}>
      <tbody>
        <tr>
          <td
            style={{
              width: 130,
              padding: "12px 14px 12px 0",
              borderBottom: `1px solid ${EMAIL_LINE}`,
              color: EMAIL_MUTED,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              verticalAlign: "top",
              fontFamily: EMAIL_FONT,
            }}>
            {props.isLabelHTML ? <StyledHtmlContent htmlContent={safeLabel} /> : props.label}
          </td>
          <td
            style={{
              padding: "12px 0",
              borderBottom: `1px solid ${EMAIL_LINE}`,
              color: EMAIL_INK,
              fontSize: 16,
              fontWeight: props.formatted ? 400 : 700,
              lineHeight: 1.45,
              verticalAlign: "top",
              fontFamily: EMAIL_FONT,
              textDecoration: props.lineThrough ? "line-through" : undefined,
              whiteSpace: props.formatted ? undefined : "pre-wrap",
            }}>
            {props.formatted ? <StyledHtmlContent htmlContent={safeDescription} /> : props.description}
            {props.extraInfo}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
