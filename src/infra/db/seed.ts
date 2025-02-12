import fs from "fs";
import { join } from "path";
import { AddMovieBySeed } from "@/usecases/AddMovieBySeed";
import { AddStudio } from "@/usecases/AddStudio";
import { AddProducer } from "@/usecases/AddProducer";
import { clearDb } from "./clear-db";

const lines = fs
  .readFileSync(join(__dirname, "movielist_little.csv"), "utf-8")
  .split("\n")
  .filter((line) => !!line.trim())
  .slice(1)
  .map((line) => line.split(";"));

const CsvMap = {
  year: 0,
  title: 1,
  studios: 2,
  producers: 3,
  winner: 4,
};

function getListFromField(list: string) {
  return list
    .replace(", and ", ",")
    .replace(" and ", ",")
    .split(",")
    .map((item) => item.trim());
}

function getProducersAndStudios() {
  const studios = new Set<string>();
  const producers = new Set<string>();

  for (const line of lines) {
    for (const studio of getListFromField(line[CsvMap.studios])) {
      studios.add(studio);
    }
    for (const producer of getListFromField(line[CsvMap.producers])) {
      producers.add(producer);
    }
  }

  return {
    studios,
    producers,
  };
}

async function populateStudiosAndProducers() {
  const addStudio = new AddStudio();
  const { studios, producers } = getProducersAndStudios();
  for (const studio of studios) {
    await addStudio.execute(studio);
  }
  const addProducer = new AddProducer();
  for (const producer of producers) {
    await addProducer.execute(producer);
  }
}

async function populateMovies() {
  const addMovie = new AddMovieBySeed();
  for (const line of lines) {
    await addMovie.execute({
      title: line[CsvMap.title].trim(),
      year: Number(line[CsvMap.year].trim()),
      winner: line[CsvMap.winner].trim().toLowerCase() === "yes",
      producers: getListFromField(line[CsvMap.producers]),
      studios: getListFromField(line[CsvMap.studios]),
    });
  }
}

export default async function seed() {
  await clearDb();
  await populateStudiosAndProducers();
  await populateMovies();
}
