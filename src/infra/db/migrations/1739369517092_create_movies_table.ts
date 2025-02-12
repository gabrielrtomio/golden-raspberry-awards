import { Db } from "../Db";

export async function up() {
  await Db.exec(
    "CREATE TABLE movies (title TEXT, year INTEGER, winner INTEGER)"
  );
}

export async function down() {
  await Db.exec("DROP TABLE movies");
}
