#!/usr/bin/node
import fs from "fs";
import path from "path";

import svgrCore from "@svgr/core";
import { ESLint } from "eslint";

import parameters from "./SVGR/parameters.mjs";
import templateWithGradient from "./SVGR/templateWithGradient.mjs";

const svgr = svgrCore.default;

console.time("Finished in");
console.log("Converting Keyrune SVG files...\n");

const prefixDefault = "Symbol";
const prefixKeyrune = "Keyrune";
const defaultSet = "BCORE";

const repositoryRoot = new URL("../", import.meta.url).pathname;

const absolutePaths = {
  MTGJSON: path.join(repositoryRoot, "./cache/MTGJSON/"),
  SVGR: path.join(repositoryRoot, "./cache/SVGR/"),
  Keyrune: path.join(repositoryRoot, "./node_modules/keyrune/svg/"),
};

const SetList = JSON.parse(
  fs.readFileSync(path.join(absolutePaths.MTGJSON, "./SetList.json"))
);

const AllSets = SetList.data;
// const LimitedSets = SetList.data.slice(0, 3);
// const AllSets = LimitedSets;

// Add "BCORE" as a special case
AllSets.unshift({
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

fs.mkdirSync(absolutePaths.SVGR, { recursive: true });

const options = {
  typescript: true,
  memo: true,
  ref: true,
  plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx", "@svgr/plugin-prettier"],
  template: templateWithGradient,
};

const sanitize = (string) => string.replace(/-|_/gi, "");

const writeSVGR = async (keyruneCode) => {
  const svgOutputPath = path.join(absolutePaths.SVGR, `${keyruneCode}.tsx`);
  const svgInputPath = path.join(absolutePaths.Keyrune, `${keyruneCode}.svg`);

  const svgCode = await fs.promises.readFile(svgInputPath);

  const component = await svgr(svgCode, options, {
    componentName: `${prefixKeyrune}${sanitize(keyruneCode)}`,
  });

  await fs.promises.writeFile(svgOutputPath, component);
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

  sets.forEach(({ code, name }) => {
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
      .map((code) => `default as ${prefixDefault}${code}`)
      .join(joinExports)}${paddingExportEnd}} from "./${primaryKey}";`,
  ].join("\n");
};
const defaultCodes = new Map();
const missingCodes = new Map();
const foundCodes = new Map();

const allFiles = await fs.promises.readdir(absolutePaths.Keyrune);
const allKeyrune = new Set(
  allFiles.map((name) => path.basename(name, ".svg").toUpperCase())
);
const unusedKeyrune = new Set(allKeyrune);
const noRarityColors = new Set();
const noMythicRare = new Set();

await Promise.allSettled(
  AllSets.map(async (set) => {
    const { keyruneCode } = set;

    if (!set.releaseDate || set.releaseDate < parameters.mythicRareIntroduced) {
      noMythicRare.add(set.code);
      noRarityColors.add(set.code);
    } else if (set.releaseDate < parameters.rarityColorsIntroduced) {
      noRarityColors.add(set.code);
    }

    if (keyruneCode === "DEFAULT") {
      updateMap(defaultCodes, { ...set, keyruneCode: defaultSet });
      // Nothing to convert
      return null;
    }

    if (allKeyrune.has(keyruneCode)) {
      try {
        writeSVGR(keyruneCode);

        unusedKeyrune.delete(keyruneCode);

        return updateMap(foundCodes, set);
      } catch (error) {
        console.error(error);
      }
    }

    return updateMap(missingCodes, { ...set, keyruneCode: defaultSet });
  })
);

let finalSize = 0;

[foundCodes, defaultCodes, missingCodes].forEach((map) => {
  for (const set of map.values()) {
    finalSize += set.size;
  }
});

if (finalSize < AllSets.length) {
  const setsNotOutput = [];

  AllSets.forEach((set) => {
    if (
      !foundCodes.has(set.code) &&
      !defaultCodes.has(set.code) &&
      !missingCodes.has(set.code)
    ) {
      setsNotOutput.push(formatName(set));
    }
  });
  console.error(
    `SetList.json contains ${AllSets.length} sets, but only ${finalSize} files were output!`
  );
  console.error(
    ["The following sets are missing:", ...setsNotOutput].join("\n")
  );
  throw new Error("Fatal: Did not output all sets");
}

const indexFile = [
  "/** GENERATED FILE! DO NOT EDIT! */",
  "",
  `export const PREFIX = "${prefixDefault}";`,
  "",
  `export const noRarityColors = new Set(${JSON.stringify(
    Array.from(noRarityColors),
    null,
    2
  )});\n`,
  `export const noMythicRare = new Set(${JSON.stringify(
    Array.from(noMythicRare),
    null,
    2
  )});\n`,
  formatCommentHeader("KEYRUNE CODES"),
  `${Array.from(foundCodes.entries()).map(formatExports).join("")}`,
];

if (defaultCodes.size) {
  console.info(
    [
      `MTJSON specified the following ${
        defaultCodes.size === 1 ? "set" : defaultCodes.size + " sets"
      } should use "DEFAULT" Keyrune icons.`,
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
      `MTGJSON specified the following ${
        missingCodes.size === 1
          ? "non-existent Keyrune code."
          : missingCodes.size + "non-existent Keyrune codes."
      }`,
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

if (unusedKeyrune.size) {
  const unused = Array.from(unusedKeyrune);

  const results = await Promise.allSettled(unused.map(writeSVGR));
  console.log(results);
  console.warn(
    [
      `${
        unusedKeyrune.size === "1"
          ? "A Keyrune code was"
          : unusedKeyrune.size + " Keyrune codes were"
      } not referenced by MTGJSON.`,
      `These will be exported with the "${prefixKeyrune}" prefix:`,
      ...unused.map((name) => ` - ${name}`),
      "\n",
    ].join("\n")
  );

  indexFile.push(
    ...[
      formatCommentHeader(
        "UNUSED KEYRUNE CODES",
        "These codes exist in Keyrune, but none of the sets described by MTGJSON referenced them."
      ),
      ...unused.map(
        (name) =>
          `export { default as ${
            prefixKeyrune + sanitize(name)
          } } from "./${name}";`
      ),
    ]
  );
}

// Add last newline
indexFile.push("");

const indexPath = path.join(absolutePaths.SVGR, "index.tsx");

await fs.promises.writeFile(indexPath, indexFile.join("\n"));

console.time("Finished in");
process.exit();
