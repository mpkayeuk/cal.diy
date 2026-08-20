import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotEnv from "dotenv";

dotEnv.config({ path: path.resolve(__dirname, "../.env") });

export type SupplementalSchemaStage = "pre-migrate" | "post-migrate";

const SUPPLEMENTAL_ROOT = path.resolve(__dirname, "supplemental-db");

function isMissingRelationError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("does not exist") || message.includes("42P01");
}

async function getPrisma() {
  const { default: prisma } = await import("@calcom/prisma");
  return prisma;
}

async function runSqlFiles(dir: string): Promise<void> {
  let files: string[];
  try {
    files = (await readdir(dir)).filter((name) => name.endsWith(".sql")).sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }
    throw error;
  }

  const prisma = await getPrisma();
  for (const file of files) {
    const sql = (await readFile(path.join(dir, file), "utf8")).trim();
    if (!sql) {
      continue;
    }
    console.info(`Applying supplemental schema ${path.basename(dir)}/${file}`);
    await prisma.$executeRawUnsafe(sql);
  }
}

export async function applySupplementalSchema(stage: SupplementalSchemaStage): Promise<void> {
  if (process.env.SKIP_SUPPLEMENTAL_SCHEMA === "1") {
    console.info("SKIP_SUPPLEMENTAL_SCHEMA set, skipping supplemental schema");
    return;
  }
  if (!process.env.DATABASE_URL) {
    console.info("No DATABASE_URL found, skipping supplemental schema");
    return;
  }

  try {
    await runSqlFiles(path.join(SUPPLEMENTAL_ROOT, stage));
  } catch (error) {
    if (stage === "pre-migrate" && isMissingRelationError(error)) {
      console.info("Skipping pre-migrate supplemental schema; database is not initialized yet");
      return;
    }
    throw error;
  }
}

async function runCli(): Promise<void> {
  const stageArg = process.argv[2];
  if (stageArg === "pre-migrate" || stageArg === "post-migrate") {
    await applySupplementalSchema(stageArg);
    return;
  }

  await applySupplementalSchema("pre-migrate");
  await applySupplementalSchema("post-migrate");
}

const isDirectRun = process.argv[1]?.includes("apply-supplemental-schema");
if (isDirectRun) {
  runCli()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(async () => {
      const prisma = await getPrisma();
      await prisma.$disconnect();
    });
}
