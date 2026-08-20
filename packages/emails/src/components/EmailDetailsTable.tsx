import type { ReactNode } from "react";

export const EMAIL_DETAILS_LABEL_WIDTH_PX = 140;

/**
 * One shared details table so Outlook keeps label/value columns aligned.
 * Separate 100% tables per row let Word auto-size each label column independently.
 */
export function EmailDetailsTable({ children }: { children: ReactNode }): JSX.Element {
  return (
    <table
      role="presentation"
      className="email-details"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      border={0}
      style={{
        width: "100%",
        maxWidth: "100%",
        tableLayout: "fixed",
        borderCollapse: "collapse",
      }}>
      <colgroup>
        <col
          className="email-details-label-col"
          width={EMAIL_DETAILS_LABEL_WIDTH_PX}
          style={{ width: EMAIL_DETAILS_LABEL_WIDTH_PX, minWidth: EMAIL_DETAILS_LABEL_WIDTH_PX }}
        />
        <col />
      </colgroup>
      <tbody>{children}</tbody>
    </table>
  );
}
