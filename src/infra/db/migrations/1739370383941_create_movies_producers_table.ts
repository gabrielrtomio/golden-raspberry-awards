import { Db } from "../Db";

export async function up() {
  await Db.exec(
    "CREATE TABLE movies_producers (movie_id INTEGER, producer_id INTEGER)"
  );
}

export async function down() {
  await Db.exec("DROP TABLE movies_producers");
}
