import { Db } from "../Db";

export async function up() {
  await Db.exec(
    "CREATE TABLE movies_studios (movie_id INTEGER, studio_id INTEGER)"
  );
}

export async function down() {
  await Db.exec("DROP TABLE movies_studios");
}
