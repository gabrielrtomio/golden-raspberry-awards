import { Db } from "@/infra/db/Db";

export class Studio {
  constructor(readonly name: string, public id?: number) {}

  async create() {
    if (this.id) throw new Error("Entidade já existe na base de dados");
    const id = await Db.run("INSERT INTO studios (name) VALUES (?)", [
      this.name,
    ]);
    this.id = id;
  }

  static async loadByNames(names: string[]): Promise<Studio[]> {
    const rows = await Db.query<StudioTable[]>(
      `SELECT rowid, name FROM studios WHERE LOWER(name) IN (${names.map(
        (studio) => `'${studio.toLowerCase()}'`
      )})`
    );
    return rows.map((row) => new Studio(row.name, row.rowid));
  }
}

type StudioTable = {
  rowid: number;
  name: string;
};
