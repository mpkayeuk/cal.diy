import { EMAIL_CARD_BG, EMAIL_FONT, EMAIL_INK, EMAIL_LINE } from "../lib/emailBrand";

export const BookingConfirmationForm = (props: { action: string; children: React.ReactNode }) => {
  return (
    <form action={props.action} method="POST" target="_blank">
      {props.children}
      <p
        style={{
          display: "inline-block",
          background: EMAIL_CARD_BG,
          border: "",
          color: EMAIL_INK,
          fontFamily: EMAIL_FONT,
          fontSize: "0.875rem",
          fontWeight: 500,
          lineHeight: "1rem",
          margin: 0,
          textDecoration: "none",
          textTransform: "none",
          padding: "0.625rem 0",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          msoPaddingAlt: "0px",
          borderRadius: "6px",
          boxSizing: "border-box",
          height: "2.25rem",
          width: "100%",
        }}>
        <label
          style={{
            color: EMAIL_INK,
            fontFamily: EMAIL_FONT,
            fontSize: "0.875rem",
            fontWeight: 500,
            lineHeight: "1rem",
            textAlign: "left",
            whiteSpace: "pre-wrap",
            display: "block",
          }}>
          Reason for rejection &nbsp;
          <small>(Optional)</small>
        </label>
        <textarea
          name="reason"
          placeholder="Why are you rejecting?"
          style={{
            appearance: "none",
            backgroundColor: EMAIL_CARD_BG,
            borderColor: EMAIL_LINE,
            borderRadius: "6px",
            borderStyle: "solid",
            borderWidth: "1px",
            boxSizing: "border-box",
            color: EMAIL_INK,
            display: "block",
            fontSize: "14px",
            lineHeight: "20px",
            marginBottom: "16px",
            marginLeft: "0px",
            marginRight: "0px",
            marginTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingTop: "8px",
            resize: "vertical",
            tabSize: 4,
            textAlign: "start",
            visibility: "visible",
            width: "100%",
            maxWidth: 550,
          }}
          rows={3}
        />
      </p>
    </form>
  );
};
