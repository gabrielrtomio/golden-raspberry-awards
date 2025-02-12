import { Db } from "@/infra/db/Db";
import { Studio } from "./Studio";
import { Producer } from "./Producer";

export class Movie {
  constructor(
    readonly title: string,
    readonly year: number,
    readonly winner: boolean,
    readonly studios: Studio[],
    readonly producers: Producer[],
    public id?: number
  ) {}

  async create() {
    if (this.id) throw new Error("Entidade já existe na base de dados");
    const id = await Db.run(
      "INSERT INTO movies (title, year, winner) VALUES (?, ?, ?)",
      [this.title, this.year, this.winner ? 1 : 0]
    );
    for (const producer of this.producers) {
      await Db.run(
        "INSERT INTO movies_producers (movie_id, producer_id) VALUES (?, ?)",
        [id, producer.id]
      );
    }
    for (const studio of this.studios) {
      await Db.run(
        "INSERT INTO movies_studios (movie_id, studio_id) VALUES (?, ?)",
        [id, studio.id]
      );
    }
    this.id = id;
  }
}
