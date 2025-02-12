import { Db } from "../Db";

export async function up() {
  await Db.exec("CREATE TABLE studios (name TEXT)");
}

export async function down() {
  await Db.exec("DROP TABLE studios");
}
