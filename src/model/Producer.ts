import { Db } from "@/infra/db/Db";

export class Producer {
  constructor(readonly name: string, public id?: number) {}

  async create() {
    if (this.id) throw new Error("Entidade já existe na base de dados");
    const id = await Db.run("INSERT INTO producers (name) VALUES (?)", [
      this.name,
    ]);
    this.id = id;
  }
}
