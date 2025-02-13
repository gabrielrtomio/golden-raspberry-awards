import request from "supertest";
import { Db } from "@/infra/db/Db";
import migrate from "@/infra/db/migrate";
import seed from "@/infra/db/seed";
import { before, describe, it } from "node:test";
import api from "@/infra/web/api";
import { deepEqual } from "assert";
import { join } from "path";

before(async () => {
  await Db.connect();
  await migrate();
  await seed(join(__dirname, "..", "seed-test.csv"));
});

describe("Load Awards Intervals", () => {
  it("Deve haver 3 produtores para o filme 'A Madea Family Funeral'", async () => {
    const [movie] = await Db.query<Array<{ rowid: number }>>(
      "SELECT rowid FROM movies WHERE title = ?",
      ["A Madea Family Funeral"]
    );
    const producers = await Db.query<Array<{ rowid: number }>>(
      "SELECT rowid FROM movies_producers WHERE movie_id = ?",
      [movie.rowid]
    );
    deepEqual(producers.length, 3);
  });

  it("Deve haver 3 studios para o filme 'Sex and the City 2'", async () => {
    const [movie] = await Db.query<Array<{ rowid: number }>>(
      "SELECT rowid FROM movies WHERE title = ?",
      ["Sex and the City 2"]
    );
    const studios = await Db.query<Array<{ rowid: number }>>(
      "SELECT rowid FROM movies_studios WHERE movie_id = ?",
      [movie.rowid]
    );
    deepEqual(studios.length, 3);
  });

  it("Deve haver 7 produtores para o filme 'Dirty Love'", async () => {
    const [movie] = await Db.query<Array<{ rowid: number }>>(
      "SELECT rowid FROM movies WHERE title = ?",
      ["Dirty Love"]
    );
    const producers = await Db.query<Array<{ rowid: number }>>(
      "SELECT rowid FROM movies_producers WHERE movie_id = ?",
      [movie.rowid]
    );
    deepEqual(producers.length, 7);
  });

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
