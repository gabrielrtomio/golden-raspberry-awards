import fs from "fs";
import { join } from "path";
import { AddMovieBySeed } from "@/use-cases/AddMovieBySeed";
import { AddStudio } from "@/use-cases/AddStudio";
import { AddProducer } from "@/use-cases/AddProducer";
import { clearDb } from "./clear-db";
import { Producer } from "@/model/Producer";
import { Studio } from "@/model/Studio";

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

function getProducersAndStudios(lines: string[][]) {
  const producersNames = new Set<string>();
  const studiosNames = new Set<string>();

  for (const line of lines) {
    for (const producerName of getListFromField(line[CsvMap.producers])) {
      producersNames.add(producerName);
    }
    for (const studioName of getListFromField(line[CsvMap.studios])) {
      studiosNames.add(studioName);
    }
  }

  return {
    producersNames,
    studiosNames,
  };
}

async function populateStudiosAndProducers(lines: string[][]) {
  const addStudio = new AddStudio();
  const { producersNames, studiosNames } = getProducersAndStudios(lines);
  const producersByName = new Map<string, Producer>();
  const studiosByName = new Map<string, Studio>();
  for (const studioName of studiosNames) {
    const studio = await addStudio.execute(studioName);
    studiosByName.set(studioName, studio);
  }
  const addProducer = new AddProducer();
  for (const producerName of producersNames) {
    const producer = await addProducer.execute(producerName);
    producersByName.set(producerName, producer);
  }
  return {
    producersByName,
    studiosByName,
  };
}

async function populateMovies(
  lines: string[][],
  producersByName: Map<string, Producer>,
  studiosByName: Map<string, Studio>
) {
  const addMovie = new AddMovieBySeed();
  for (const line of lines) {
    const producers: Producer[] = [];
    for (const producerName of getListFromField(line[CsvMap.producers])) {
      const maybeProducer = producersByName.get(producerName);
      if (!maybeProducer)
        throw new Error(`Produtor não encontrado: ${producerName}`);
      producers.push(maybeProducer);
    }
    const studios: Studio[] = [];
    for (const studioName of getListFromField(line[CsvMap.studios])) {
      const maybeStudio = studiosByName.get(studioName);
      if (!maybeStudio) throw new Error(`Studio não encontrado: ${studioName}`);
      studios.push(maybeStudio);
    }
    await addMovie.execute({
      title: line[CsvMap.title].trim(),
      year: Number(line[CsvMap.year].trim()),
      winner: line[CsvMap.winner].trim().toLowerCase() === "yes",
      producers,
      studios,
    });
  }
}

export default async function seed(filename: string) {
  console.log("📖 Lendo arquivo...");
  const lines = fs
    .readFileSync(filename, "utf-8")
    .split("\n")
    .filter((line) => !!line.trim())
    .slice(1)
    .map((line) => line.split(";"));

  console.log("🗑 Deletando dados...");
  await clearDb();
  console.log("📽 Populando studios e produtores...");
  const { producersByName, studiosByName } = await populateStudiosAndProducers(
    lines
  );
  console.log("🎞 Populando filmes...");
  await populateMovies(lines, producersByName, studiosByName);
}
