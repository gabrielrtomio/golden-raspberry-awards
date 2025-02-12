import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { join } from "path";

export abstract class Db {
  private static db: Database | null;

  static async connect() {
    if (!this.db) {
      this.db = await open({
        filename: join(__dirname, "database.db"),
        driver: sqlite3.Database,
      });
    }
  }

  static async exec(sql: string) {
    await this.db!.exec(sql);
  }

  static async query<T = unknown>(
    sql: string,
    params: unknown[] = []
  ): Promise<T> {
    return this.db!.all(sql, ...params);
  }

  static async run(sql: string, params: unknown[] = []) {
    await this.db!.run(sql, params);
  }
}
