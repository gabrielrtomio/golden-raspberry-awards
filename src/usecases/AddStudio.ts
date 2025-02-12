import { UseCase } from "@/core/usecases/UseCase";
import { Studio } from "@/model/Studio";

export class AddStudio implements UseCase<string> {
  async execute(name: string): Promise<void> {
    const studios = await Studio.loadByNames([name]);
    if (studios.length > 0) {
      throw new Error("Studio já cadastrado");
    }
    const newStudio = new Studio(name);
    await newStudio.create();
  }
}
