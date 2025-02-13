import { join } from "path";
import { Db } from "../db/Db";
import migrate from "../db/migrate";
import seed from "../db/seed";
import api from "./api";

const PORT = 3000;

async function startServer() {
  await Db.connect();
  await migrate();
  await seed(join(__dirname, "..", "..", "..", "seed.csv"));
  api.listen(PORT, () => console.log(`🖥 Server Listening in PORT ${PORT}`));
}

startServer();
