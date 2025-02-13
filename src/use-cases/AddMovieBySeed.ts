import { UseCase } from "@/core/usecases/UseCase";
import { Movie } from "@/model/Movie";
import { Producer } from "@/model/Producer";
import { Studio } from "@/model/Studio";

type MovieAttributes = {
  title: string;
  year: number;
  winner: boolean;
  studios: Studio[];
  producers: Producer[];
};

export class AddMovieBySeed implements UseCase<MovieAttributes> {
  async execute(params: MovieAttributes): Promise<void> {
    const newMovie = new Movie(
      params.title,
      params.year,
      params.winner,
      params.studios,
      params.producers
    );
    await newMovie.create();
  }
}
