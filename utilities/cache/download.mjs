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
  let stale = false;

  Object.values(filePaths).forEach((value) => {
    const stats = fs.statSync(value);
    const lastModified = stats.mtimeMs;

    if (typeof lastModified !== "number") {
      stale = true;
      console.warn(`[ MISSING ] - ${path.basename(value)}`);
    } else if (lastModified < YESTERDAY) {
      stale = true;

      if (verbose) {
        console.warn(`[  STALE  ] - ${path.basename(value)}`);
      }
    } else if (verbose) {
      console.info(`[  FRESH  ] - ${path.basename(value)}`);
    }
  });

  return stale;
};
