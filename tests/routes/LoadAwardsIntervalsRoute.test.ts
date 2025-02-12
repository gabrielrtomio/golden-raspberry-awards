import request from "supertest";
import { Db } from "@/infra/db/Db";
import migrate from "@/infra/db/migrate";
import seed from "@/infra/db/seed";
import { before, describe, it } from "node:test";
import api from "@/infra/web/api";
import { deepEqual } from "assert";

before(async () => {
  //passar o path da database no connect
  await Db.connect();
  await migrate();
  //passar o path do csv no seed
  await seed();
});
describe("Load Awards Intervals", () => {
  it("Deve retornar Joel Silver no mínimo e Matheuw Vaughn no máximo", async () => {
    const response = await request(api).get("/api/awards/intervals").query({});
    deepEqual(response.body, {
      min: [
        {
          producer: "Joel Silver",
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: "Matthew Vaughn",
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    });
  });
});
