#!/usr/bin/node
import fs from "fs";
import path from "path";

export const TODAY = Date.now();
export const ONE_DAY =
  1000 /* milliseconds */ *
  60 /* seconds */ *
  60 /* minutes */ *
  24; /* hours */
export const YESTERDAY = TODAY - ONE_DAY;

export const getFilePaths = (directory, filename) => ({
  json: `${directory}/${filename}.json`,
  ts: `${directory}/${filename}.ts`,
});

/**
 * For the purposes of this caching tool, "staleness" is reset daily. MTG sets
 * change infrequently enough that there's unlikely to be an hour-to-hour
 * variance that impacts the cache.
 *
 * @param {*} filePaths
 */
export const determineStale = (filePaths, verbose) => {
  let stale = true;

  Object.values(filePaths).forEach((value) => {
    let stats;

    try {
      stats = fs.statSync(value);
    } catch (error) {
      if (verbose) {
        console.info(`${value} does not exist, will be marked stale`);
      }
    }

    if (
      stats &&
      typeof stats.mtimeMs === "number" &&
      stats.mtimeMs > YESTERDAY
    ) {
      if (verbose) {
        console.info(`[  FRESH  ] - ${path.basename(value)}`);
      }
      stale = false;
    } else if (verbose) {
      console.info(`[  STALE  ] - ${path.basename(value)}`);
    }
  });

  return stale;
};
