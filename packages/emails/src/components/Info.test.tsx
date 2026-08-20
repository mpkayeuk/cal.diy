import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EmailDetailsTable } from "./EmailDetailsTable";
import { Info } from "./Info";

describe("Email details layout", () => {
  it("renders one fixed two-column table so every row shares the same label width", () => {
    const html = renderToStaticMarkup(
      <EmailDetailsTable>
        <Info label="What" description="Intro call" withSpacer />
        <Info
          label="What business problem would you like to solve?"
          description="https://example.com/very/long/path/that-should-wrap-inside-the-value-column?token=abcdefghijklmnopqrstuvwxyz"
          withSpacer
        />
      </EmailDetailsTable>
    );

    expect(html.match(/class="email-details"/g)).toHaveLength(1);
    expect(html).toMatch(/table-layout:\s*fixed/);
    expect(html).toContain('width="140"');
    expect(html).toContain("What business problem would you like to solve?");
    expect(html).toMatch(/text-transform:\s*uppercase/);
    expect(html).toMatch(/word-break:\s*break-word/);
    expect(html).toMatch(/overflow-wrap:\s*anywhere/);
  });
});
