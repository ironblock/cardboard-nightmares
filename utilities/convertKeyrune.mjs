#!/usr/bin/node
import fs from "fs";
import path from "path";

import svgrCore from "@svgr/core";
import { ESLint } from "eslint";

const svgr = svgrCore.default;

console.time("Finished in");
console.log("Converting Keyrune SVG files...\n");

const prefix = "Symbol";
const defaultSet = "BCORE";

const cacheDir = new URL("../cache/", import.meta.url);
const nodeModulesDir = new URL("../node_modules/", import.meta.url);
const directory = {
  MTGJSON: path.join(cacheDir.pathname, "./MTGJSON/"),
  SVGR: path.join(cacheDir.pathname, "./SVGR/"),
  Keyrune: path.join(nodeModulesDir.pathname, "./keyrune/svg/"),
};

const SetList = JSON.parse(
  fs.readFileSync(path.join(directory.MTGJSON, "./SetList.json"))
);

// Add "BCORE" as a special case
SetList.data.unshift({
  baseSetSize: 0,
  code: "BCORE",
  isFoilOnly: false,
  isNonFoilOnly: false,
  isOnlineOnly: false,
  keyruneCode: "BCORE",
  name: "Blank Core Set",
  releaseDate: "1900-01-01",
  totalSetSize: 0,
  type: "promo",
});

fs.mkdirSync(directory.SVGR, { recursive: true });

const options = {
  typescript: true,
  memo: true,
  ref: true,
};

const updateMap = (map, { keyruneCode, name, code }) =>
  map.set(
    keyruneCode,
    new Set([{ keyruneCode, name, code }, ...(map.get(keyruneCode) ?? [])])
  );
const wrap = (s, w) =>
  s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"), "$1\n");

const formatCommentHeader = (title, comment) => {
  const header = ["", "/**", ` * ${title}`];
  if (comment) {
    header.push(
      ...wrap(comment, 75)
        .split("\n")
        .map((line) => ` * ${line}`)
    );
  }

  header.push(" */");
  return header.flat().join("\n");
};

const formatName = ({ keyruneCode, name, code }) =>
  `${
    keyruneCode && keyruneCode !== defaultSet ? `${keyruneCode}: ` : ""
  }"${name} (${code})"`;

const formatExports = ([primaryKey, sets]) => {
  const comments = [`${primaryKey}:`];
  const toExport = new Set();
  let paddingCommentsEnd;
  let joinComments;
  let paddingExportStart;
  let paddingExportEnd;
  let joinExports;

  sets.forEach(({ code, keyruneCode, name }) => {
    comments.push(formatName({ name, code }));
    toExport.add(code);
  });

  if (comments.length > 2) {
    joinComments = "\n * ";
    paddingCommentsEnd = "\n";
  } else {
    joinComments = " ";
    paddingCommentsEnd = "";
  }

  if (toExport.size > 2) {
    paddingExportStart = "\n  ";
    joinExports = ",\n  ";
    paddingExportEnd = ",\n";
  } else {
    paddingExportStart = " ";
    joinExports = ", ";
    paddingExportEnd = " ";
  }

  return [
    "",
    `/**${joinComments}${comments.join(joinComments)}${paddingCommentsEnd} */`,
    `export {${paddingExportStart}${Array.from(toExport)
      .map((code) => `default as ${prefix}${code}`)
      .join(joinExports)}${paddingExportEnd}} from "./${primaryKey}";`,
  ].join("\n");
};
const defaultCodes = new Map();
const missingCodes = new Map();
const foundCodes = new Map();

await Promise.allSettled(
  SetList.data.map(async (set) => {
    const { keyruneCode, code, name } = set;
    const keyruneSourcePath = path.join(
      directory.Keyrune,
      `${keyruneCode.toLowerCase()}.svg`
    );

    try {
      const jsonStats = await fs.promises.lstat(keyruneSourcePath);
    } catch (error) {
      if (keyruneCode === "DEFAULT") {
        updateMap(defaultCodes, { ...set, keyruneCode: defaultSet });
      } else {
        updateMap(missingCodes, { ...set, keyruneCode: defaultSet });
      }

      // Nothing to convert
      return null;
    }

    try {
      const svgOutputPath = path.join(
        directory.SVGR,
        `${keyruneCode.toUpperCase()}.tsx`
      );
      const svgCode = await fs.promises.readFile(keyruneSourcePath);

      const component = await svgr(svgCode, options, {
        componentName: `Keyrune${keyruneCode}`,
      });

      await fs.promises.writeFile(svgOutputPath, component);
      updateMap(foundCodes, set);
    } catch (error) {
      updateMap(missingCodes, { ...set, keyruneCode: defaultSet });
    }
  })
);

let finalSize = 0;

[foundCodes, defaultCodes, missingCodes].forEach((map) => {
  for (const set of map.values()) {
    finalSize += set.size;
  }
});

if (finalSize < SetList.data.length) {
  const setsNotOutput = [];

  SetList.data.forEach((set) => {
    if (
      !foundCodes.has(set.code) &&
      !defaultCodes.has(set.code) &&
      !missingCodes.has(set.code)
    ) {
      setsNotOutput.push(formatName(set));
    }
  });
  console.error(
    `SetList.json contains ${SetList.data.length} sets, but only ${finalSize} files were output!`
  );
  console.error(
    ["The following sets are missing:", ...setsNotOutput].join("\n")
  );
  throw new Error("Fatal: Did not output all sets");
}

const indexFile = [
  "/** GENERATED FILE! DO NOT EDIT! */",
  "",
  `export const PREFIX = "${prefix}";`,
  formatCommentHeader("KEYRUNE CODES"),
  `${Array.from(foundCodes.entries()).map(formatExports).join("")}`,
];

if (defaultCodes.size) {
  console.info(
    [
      'MTJSON specified the following sets should use "DEFAULT" Keyrune icons.',
      'These will use "Blank Core Set":',
      ...Array.from(defaultCodes.get(defaultSet).entries()).map(
        ([primaryKey, set]) => `  - ${formatName(set)}`
      ),
      "\n",
    ].join("\n")
  );

  indexFile.push(
    ...[
      formatCommentHeader("DEFAULT"),
      Array.from(defaultCodes.entries()).map(formatExports).join(""),
    ]
  );
}

if (missingCodes.size) {
  console.warn(
    [
      "MTGJSON specified the following non-existent Keyrune codes.",
      'These will fall back to "Blank Core Set":',
      ...Array.from(missingCodes.entries()).map(([primaryKey, sets]) =>
        Array.from(sets).map((set) => `  - ${formatName(set)}`)
      ),
      "\n",
    ]
      .flat()
      .join("\n")
  );

  indexFile.push(
    ...[
      formatCommentHeader(
        "MISSING CODES",
        "These codes were specified by MTGJSON, but not actually found in the Keyrune repository."
      ),
      Array.from(missingCodes.entries()).map(formatExports).join(""),
    ]
  );
}

// Add last newline
indexFile.push("");

const indexPath = path.join(directory.SVGR, "index.tsx");

await fs.promises.writeFile(indexPath, indexFile.join("\n"));

console.time("Finished in");
process.exit();
