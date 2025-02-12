import { readdirSync } from "fs";
import { join } from "path";
import { Db } from "./Db";

type MigrationSchema = {
  id: number;
  name: string;
};

export default async function migrate() {
  try {
    const migrationFiles = readdirSync(join(__dirname, "migrations"));
    migrationFiles.sort((a, b) => a.localeCompare(b));
    await Db.exec(`CREATE TABLE IF NOT EXISTS migrations (name TEXT)`);
    const migrations = await Db.query<MigrationSchema[]>(
      `SELECT * FROM migrations`
    );
    for (const migrationFile of migrationFiles) {
      const [migrationName] = migrationFile.split(".");
      if (
        !migrations.some(
          (migration: MigrationSchema) => migration.name === migrationName
        )
      ) {
        const path = join(__dirname, "migrations", migrationFile);
        const migrationModule = await import(path);
        await migrationModule.up();
        await Db.run(`INSERT INTO migrations (name) VALUES (?)`, [
          migrationName,
        ]);
        console.log(`Migration executed ${migrationName}`);
      }
    }
  } catch (e) {
    console.log(e);
  }
}
