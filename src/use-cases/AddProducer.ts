import { UseCase } from "@/core/usecases/UseCase";
import { Producer } from "@/model/Producer";

export class AddProducer implements UseCase<string, Producer> {
  async execute(name: string): Promise<Producer> {
    const newProducer = new Producer(name);
    await newProducer.create();
    return newProducer;
  }
}
