import { UseCase } from "@/core/usecases/UseCase";
import { Producer } from "@/model/Producer";

export class AddProducer implements UseCase<string> {
  async execute(name: string): Promise<void> {
    const producers = await Producer.loadByNames([name]);
    if (producers.length > 0) {
      throw new Error("Produtor já cadastrado");
    }
    const newProducer = new Producer(name);
    await newProducer.create();
  }
}
