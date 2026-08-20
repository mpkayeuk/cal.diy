import { exec as execCb } from "node:child_process";
import process from "node:process";
import { promisify } from "node:util";
import dotEnv from "dotenv";
import { isPrismaAvailableCheck } from "./is-prisma-available-check";

dotEnv.config({ path: "../../.env" });

const exec = promisify(execCb);

/**
 * TODO: re-write this when Prisma.io gets a programmatic migration API
 * Thanks to @olalonde for the idea.
 * @see https://github.com/prisma/prisma/issues/4703#issuecomment-1447354363
 */
async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.info("No DATABASE_URL found, skipping migrations");
    return;
  }

  const { applySupplementalSchema } = await import("../../scripts/apply-supplemental-schema");
  await applySupplementalSchema("pre-migrate");

  if (process.env.SKIP_DB_MIGRATIONS === "1") {
    console.info("SKIP_DB_MIGRATIONS set, skipping prisma migrate deploy");
  } else if (!process.env.DATABASE_DIRECT_URL) {
    console.info("No DATABASE_DIRECT_URL found, skipping prisma migrate deploy");
  } else if (!(await isPrismaAvailableCheck())) {
    console.info("Prisma can't be initialized, skipping prisma migrate deploy");
  } else {
    const { stdout, stderr } = await exec("yarn prisma migrate deploy", {
      env: {
        ...process.env,
      },
    });
    console.log(stdout);
    console.error(stderr);
  }

  await applySupplementalSchema("post-migrate");
}

main().catch((e) => {
  console.error(e.stdout || e.stderr || e.message);
  process.exit(1);
});
