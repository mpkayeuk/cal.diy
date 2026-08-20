import type { BodyHeadType } from "./EmailSchedulingBodyHeader";
import { EmailShell } from "./EmailShell";

export const V2BaseEmailHtml = (props: {
  children: React.ReactNode;
  callToAction?: React.ReactNode;
  subject: string;
  title?: string;
  subtitle?: React.ReactNode;
  headerType?: BodyHeadType;
  hideLogo?: boolean;
}) => {
  return (
    <EmailShell
      subject={props.subject}
      title={props.title}
      subtitle={props.subtitle}
      callToAction={props.callToAction}
      hideLogo={props.hideLogo}>
      {props.children}
    </EmailShell>
  );
};
