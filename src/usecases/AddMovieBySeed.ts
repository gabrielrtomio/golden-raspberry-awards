import { UseCase } from "@/core/usecases/UseCase";
import { Movie } from "@/model/Movie";
import { Producer } from "@/model/Producer";
import { Studio } from "@/model/Studio";

type MovieAttributes = {
  title: string;
  year: number;
  winner: boolean;
  studios: string[];
  producers: string[];
};

export class AddMovieBySeed implements UseCase<MovieAttributes> {
  async execute(params: MovieAttributes): Promise<void> {
    const studios = await Studio.loadByNames(params.studios);
    if (studios.length !== params.studios.length) {
      throw new Error("Alguns studios não foram encontrados");
    }
    const producers = await Producer.loadByNames(params.producers);
    if (producers.length !== params.producers.length) {
      throw new Error("Alguns produtores não foram encontrados");
    }
    const newMovie = new Movie(
      params.title,
      params.year,
      params.winner,
      studios,
      producers
    );
    await newMovie.create();
  }
}
