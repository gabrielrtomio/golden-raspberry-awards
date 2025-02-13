import { Controller } from "@/core/controllers/Controller";
import { Db } from "@/infra/db/Db";

export class LoadAwardsIntervalsController implements Controller<void, Res> {
  async handle(): Promise<Res> {
    const awardsIntervals = await Db.query<AwardIntervalQueryResult[]>(`--sql
      WITH awards_intervals AS (
        SELECT
          LAG(movies.year) OVER (PARTITION BY producers.rowid ORDER BY movies.year) previous_win,
          movies.year following_win,
          producers.name producer,
          movies.year - LAG(movies.year) OVER (PARTITION BY producers.rowid ORDER BY movies.year) interval
        FROM movies
        LEFT JOIN movies_producers mp ON mp.movie_id = movies.rowid
        LEFT JOIN producers ON mp.producer_id = producers.rowid
        WHERE movies.winner = 1
      )
      SELECT
        awards_intervals.previous_win,
        awards_intervals.following_win,
        awards_intervals.producer,
        awards_intervals.interval
      FROM awards_intervals
      WHERE awards_intervals.interval = (
        SELECT MIN(min_awards.interval) FROM awards_intervals AS min_awards
        WHERE min_awards.interval IS NOT NULL GROUP BY min_awards.interval 
        ORDER BY min_awards.interval ASC LIMIT 1
      )
      UNION
      SELECT
        awards_intervals.previous_win,
        awards_intervals.following_win,
        awards_intervals.producer,
        awards_intervals.interval
      FROM awards_intervals
      WHERE awards_intervals.interval = (
        SELECT MAX(max_intervals.interval) FROM awards_intervals AS max_intervals
        WHERE max_intervals.interval IS NOT NULL GROUP BY max_intervals.interval 
        ORDER BY max_intervals.interval DESC LIMIT 1
      )
    `);
    awardsIntervals.sort((a, b) => a.interval - b.interval);
    const minInterval = awardsIntervals[0]?.interval ?? 0;
    const maxInterval =
      awardsIntervals[awardsIntervals.length - 1]?.interval ?? 0;
    return {
      min: awardsIntervals
        .filter((awardInterval) => awardInterval.interval === minInterval)
        .map(toResponse),
      max: awardsIntervals
        .filter((awardInterval) => awardInterval.interval === maxInterval)
        .map(toResponse),
    };
  }
}

const toResponse = (
  awardInterval: AwardIntervalQueryResult
): AwardInterval => ({
  producer: awardInterval.producer,
  interval: awardInterval.interval,
  previousWin: awardInterval.previous_win,
  followingWin: awardInterval.following_win,
});

type Res = {
  min: Array<AwardInterval>;
  max: Array<AwardInterval>;
};

type AwardInterval = {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};

type AwardIntervalQueryResult = {
  producer: string;
  interval: number;
  previous_win: number;
  following_win: number;
};
