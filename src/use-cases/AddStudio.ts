import { UseCase } from "@/core/usecases/UseCase";
import { Studio } from "@/model/Studio";

export class AddStudio implements UseCase<string, Studio> {
  async execute(name: string): Promise<Studio> {
    const newStudio = new Studio(name);
    await newStudio.create();
    return newStudio;
  }
}
