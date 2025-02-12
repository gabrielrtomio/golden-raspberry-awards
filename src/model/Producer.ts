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

  static async loadByNames(names: string[]): Promise<Producer[]> {
    const rows = await Db.query<ProducerTable[]>(
      `SELECT rowid, name FROM producers WHERE LOWER(name) IN (${names.map(
        (producer) => `'${producer.toLowerCase()}'`
      )})`
    );
    return rows.map((row) => new Producer(row.name, row.rowid));
  }
}

type ProducerTable = {
  rowid: number;
  name: string;
};
