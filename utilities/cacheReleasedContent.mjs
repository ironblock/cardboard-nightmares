#!/usr/bin/node
import fs from "fs";
import https from "https";
import util from "util";

import cliProgress from "cli-progress";
import { ESLint } from "eslint";

console.time("Finished in");
console.log("Updating MTGJSON resource files...\n");

const cacheDir = new URL("../cache", import.meta.url).pathname;
await fs.mkdirSync(cacheDir, { recursive: true });

const files = {
  "SetList.json": "https://mtgjson.com/api/v5/SetList.json",
  "EnumValues.json": "https://mtgjson.com/api/v5/EnumValues.json",
};
const fileNames = Object.keys(files);
const today = Date.now();
const oneDay =
  1000 /* milliseconds */ *
  60 /* seconds */ *
  60 /* minutes */ *
  24; /* hours */
const yesterday = today - oneDay;

const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
    format: "|{bar}| {percentage}% - {key}",
  },
  cliProgress.Presets.shades_grey
);
const bars = fileNames.reduce((output, key) => {
  output[key] = multibar.create(100, 0, { key });

  return output;
}, {});

const downloads = await Promise.all(
  fileNames.map(async (key) => {
    const baseName = key.replace(/\.json$/, "");
    const jsonFilePath = `${cacheDir}/${baseName}.json`;
    const tsFilePath = `${cacheDir}/${baseName}.ts`;

    try {
      const jsonStats = await fs.promises.lstat(jsonFilePath);
      const tsStats = await fs.promises.lstat(tsFilePath);

      if (yesterday < jsonStats.mtimeMs || yesterday < tsStats.mtimeMs) {
        return bars[key].update(100, { key });
      }
    } catch (error) {
      const response = await new Promise((resolve) =>
        https.get(files[key], resolve)
      );

      const content = await new Promise((resolve, reject) => {
        const contentType = response.headers["content-type"];
        const contentLength = response.headers["content-length"];
        const { statusCode } = response;

        let error;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
          error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            "Invalid content-type.\n" +
              `Expected application/json but received ${contentType}`
          );
        }
        if (error) {
          // Consume response data to free up memory
          response.resume();
          reject(error.message);
          return;
        }

        response.setEncoding("utf8");

        let received = 0;
        let rawData = "";

        response.on("data", (chunk) => {
          received += chunk.length;
          rawData += chunk;
          bars[key].update((received / contentLength) * 100);
        });

        response.on("end", () => {
          try {
            resolve(JSON.parse(rawData));
          } catch (e) {
            reject(e.message);
          }
        });

        response.on("error", (e) => {
          reject(`Got error: ${e.message}`);
        });
      });

      const formattedJson = JSON.stringify(content, null, 2);
      const formattedTs = `export const ${baseName} = ${util.inspect(
        content
      )} as const;\n\nexport default ${baseName};\n`;

      await fs.promises.writeFile(jsonFilePath, formattedJson);
      await fs.promises.writeFile(tsFilePath, formattedTs);

      return true;
    }

    return false;
  })
);

const eslint = new ESLint({ fix: true });
const results = await eslint.lintFiles([`${cacheDir}/**`]);
await ESLint.outputFixes(results);

setTimeout(() => {
  if (downloads.includes(false)) {
    console.error("Failed to download");
    process.exit(1);
  } else {
    console.log("\n");
    console.timeEnd("Finished in");
    process.exit();
  }
}, 100);
