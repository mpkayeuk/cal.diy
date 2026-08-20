import classNames from "@calcom/ui/classNames";

export function getBookerWrapperClasses({ isEmbed }: { isEmbed: boolean }) {
  // We don't want any margins for Embed. Any margin needed should be added by Embed user.
  return classNames(
    "flex h-full w-full items-center justify-center",
    !isEmbed && "booker-page min-h-[calc(100dvh)]"
  );
}
