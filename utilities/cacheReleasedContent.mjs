#!/usr/bin/node
import fs from "fs";
import https from "https";

import cliProgress from "cli-progress";

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
    const filePath = `${cacheDir}/${key}`;
    let content = "";

    try {
      const { mtimeMs } = await fs.promises.lstat(filePath);

      if (today - oneDay < mtimeMs) {
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

      // console.log(filePath);
      // const fileHandle = await fs.promises.open(filePath);
      // await fs.promises.writeFile(fileHandle, JSON.stringify(content, null, 2));
      await fs.promises.writeFile(filePath, JSON.stringify(content, null, 2));
      // await fileHandle.close();

      return true;
    }

    return false;
  })
);

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
