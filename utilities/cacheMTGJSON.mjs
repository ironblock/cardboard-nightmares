#!/usr/bin/node
import fs from "fs";
import https from "https";

import cliProgress from "cli-progress";
import { ESLint } from "eslint";

import { getFilePaths, determineStale } from "./cache/download.mjs";

const consolePrefix = "[ MTGJSON ]";
console.time(`${consolePrefix} Done`);

const cacheDir = new URL("../cache/MTGJSON", import.meta.url).pathname;
await fs.mkdirSync(cacheDir, { recursive: true });

const files = {
  "CardTypes.json": "https://mtgjson.com/api/v5/CardTypes.json",
  "SetList.json": "https://mtgjson.com/api/v5/SetList.json",
  "EnumValues.json": "https://mtgjson.com/api/v5/EnumValues.json",
};
const resourceNames = Object.keys(files);

const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
    format: "|{bar}| {percentage}% - {key}",
  },
  cliProgress.Presets.shades_grey
);

const activeBars = {};

const updatedFiles = [];
const downloadStatus = await Promise.all(
  resourceNames.map(async (resource) => {
    const baseName = resource.replace(/\.json$/, "");
    const filePaths = getFilePaths(cacheDir, baseName);
    const stale = determineStale(filePaths, true);

    try {
      if (stale) {
        console.time(`${consolePrefix} ${resource}`);
        activeBars[resource] = multibar.create(100, 0, { key: resource });

        const response = await new Promise((resolve) =>
          https.get(files[resource], resolve)
        );

        const content = await new Promise((resolve, reject) => {
          const contentType = response.headers["content-type"];
          const contentLength = response.headers["content-length"];
          const { statusCode } = response;

          let error;
          // Any 2xx status code signals a successful response but
          // here we're only checking for 200.
          if (statusCode !== 200) {
            error = new Error(
              "Request Failed.\n" + `Status Code: ${statusCode}`
            );
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
            if (activeBars[resource]) {
              activeBars[resource].update((received / contentLength) * 100);
            }
          });

          response.on("end", () => {
            updatedFiles.push(filePaths.json);
            updatedFiles.push(filePaths.ts);
            console.timeEnd(`${consolePrefix} ${resource}`);

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
        const formattedTs = `export const ${baseName} = ${formattedJson} as const; export default ${baseName};`;

        await fs.promises.writeFile(filePaths.json, formattedJson);
        await fs.promises.writeFile(filePaths.ts, formattedTs);
      }

      return true;
    } catch (error) {
      console.error(`Error downloading ${resource}: ${error}`);
    }

    return false;
  })
);

if (updatedFiles.length) {
  console.info(
    `${consolePrefix} Running ESLint for ${updatedFiles.length} updated files`
  );
  console.time(`${consolePrefix} ESLint`);
  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintFiles(updatedFiles);
  await ESLint.outputFixes(results);
  console.timeEnd(`${consolePrefix} ESLint`);
} else {
  console.info(`${consolePrefix} All files are already up to date`);
}

setTimeout(() => {
  console.info("\n");

  if (downloadStatus.includes(false)) {
    console.error(`${consolePrefix} Update failed`);
    process.exit(1);
  } else {
    console.timeEnd(`${consolePrefix} Done`);
    process.exit();
  }
}, 100);
