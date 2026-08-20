import { DEFAULT_LIGHT_BRAND_COLOR } from "@calcom/lib/constants";

/** RZLVR colours for HTML email. Avoid 8-digit hex — Outlook and Teams drop it. */
export const EMAIL_FONT = "Arial, Helvetica, sans-serif";
/** Warm outer canvas used by rzlvr-sites Graph mail (renders reliably in Teams). */
export const EMAIL_PAGE_BG = "#e9e5da";
export const EMAIL_CARD_BG = "#fffdf7";
export const EMAIL_INK = "#112f2c";
export const EMAIL_MUTED = "#65746f";
export const EMAIL_LINE = "#d9ddd8";
export const EMAIL_HEADER_BG = "#123c37";
export const EMAIL_ACCENT = "#ff6846";
export const EMAIL_FOOTER_BG = "#0b2926";
export const EMAIL_FOOTER_TEXT = "#9bb4ad";
export const EMAIL_CALLOUT_BG = "#f3efe5";
export const EMAIL_BRAND = DEFAULT_LIGHT_BRAND_COLOR;
export const EMAIL_BRAND_TEXT = "#ffffff";
export const EMAIL_CTA_BG = EMAIL_ACCENT;
export const EMAIL_CTA_TEXT = EMAIL_INK;
export const EMAIL_LOGO_WIDTH = 185;
