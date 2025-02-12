import { Db } from "./Db";

export const clearDb = async () => {
  await Db.run("DELETE FROM studios");
  await Db.run("DELETE FROM producers");
  await Db.run("DELETE FROM movies_studios");
  await Db.run("DELETE FROM movies_producers");
  await Db.run("DELETE FROM movies");
};
