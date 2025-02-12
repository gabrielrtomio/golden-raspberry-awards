import fs from "fs";
import path from "path";

function createMigration() {
  const now = new Date().getTime();
  const name = process.argv[2]?.trim();
  if (!name) throw new Error("Migration name not found");
  const filename = `${now}_${name}.ts`;
  fs.writeFileSync(
    path.join(__dirname, "migrations", filename),
    [
      'import { Db } from "../Db";',
      "",
      "export async function up() {}",
      "",
      "export async function down() {}",
      "",
    ].join("\n")
  );
  console.log(`📄 ${filename} created`);
}

createMigration();
