import { Db } from "../db/Db";
import migrate from "../db/migrate";
import seed from "../db/seed";

async function startServer() {
  await Db.connect();
  await migrate();
  await seed();
}

startServer();
