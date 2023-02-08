#!/usr/bin/node
import fs from "fs";
import path from "path";

import svgrCore from "@svgr/core";
import { ESLint } from "eslint";

import parameters from "./SVGR/parameters.mjs";
import templateWithGradient from "./SVGR/templateWithGradient.mjs";

const replacements = {
  ...parameters.dualLayerMapping,
  ...parameters.customMapping,
};
const { transform } = svgrCore;

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
  const svgOutputPath = path.join(
    absolutePaths.SVGR,
    `${keyruneCode.toUpperCase()}.tsx`
  );
  const svgInputPath = path.join(
    absolutePaths.Keyrune,
    `${keyruneCode.toLowerCase()}.svg`
  );

  const svgCode = await fs.promises.readFile(svgInputPath);

  const component = await transform(svgCode, options, {
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

const printWarningForList = (codeMap, message) =>
  console.warn(
    [
      message,
      ...Array.from(codeMap.entries()).map(([primaryKey, sets]) =>
        Array.from(sets).map((set) => `  - ${formatName(set)}`)
      ),
      "\n",
    ]
      .flat()
      .join("\n")
  );
const replacedCodes = new Map();
const defaultCodes = new Map();
const missingCodes = new Map();
const foundCodes = new Map();

const allFiles = await fs.promises.readdir(absolutePaths.Keyrune);
const allKeyrune = new Set(
  allFiles.map((name) => path.basename(name, ".svg").toUpperCase())
);
const unusedKeyrune = new Set(allKeyrune);

await Promise.allSettled(
  AllSets.map(async (set) => {
    const { keyruneCode, code } = set;
    let targetMap;
    let usedKeyruneCode;

    if (keyruneCode === "DEFAULT") {
      targetMap = defaultCodes;
      usedKeyruneCode = defaultSet;
    } else {
      if (replacements[code]) {
        targetMap = replacedCodes;
        usedKeyruneCode = replacements[code];
      } else {
        targetMap = foundCodes;
        usedKeyruneCode = keyruneCode;
      }

      if (allKeyrune.has(usedKeyruneCode)) {
        try {
          writeSVGR(usedKeyruneCode);

          unusedKeyrune.delete(usedKeyruneCode);
        } catch (error) {
          console.error(error);
          targetMap = missingCodes;
          usedKeyruneCode = defaultSet;
        }
      } else {
        targetMap = missingCodes;
        usedKeyruneCode = defaultSet;
      }
    }

    return updateMap(targetMap, { ...set, keyruneCode: usedKeyruneCode });
  })
);

let finalSize = 0;

[replacedCodes, foundCodes, defaultCodes, missingCodes].forEach((map) => {
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
  formatCommentHeader("KEYRUNE CODES"),
  `${Array.from(foundCodes.entries()).map(formatExports).join("")}`,
];

if (defaultCodes.size) {
  printWarningForList(defaultCodes, [
    `MTJSON specified the following ${
      defaultCodes.size === 1 ? "set" : defaultCodes.size + " sets"
    } should use "DEFAULT" Keyrune icons.`,
    'These will use "Blank Core Set":',
  ]);

  indexFile.push(
    ...[
      formatCommentHeader("DEFAULT"),
      Array.from(defaultCodes.entries()).map(formatExports).join(""),
    ]
  );
}

if (missingCodes.size) {
  printWarningForList(missingCodes, [
    `MTGJSON specified the following ${
      missingCodes.size === 1
        ? "non-existent Keyrune code."
        : missingCodes.size + "non-existent Keyrune codes."
    }`,
    'These will fall back to "Blank Core Set":',
  ]);

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

if (replacedCodes.size) {
  printWarningForList(replacedCodes, [
    `The user parameters provided in dualLayerMapping and customMapping provided ${
      replacedCodes.size === 1
        ? "a single override value"
        : replacedCodes.size + "override values."
    }`,
    "These will be mapped as specified:",
  ]);

  indexFile.push(
    ...[
      formatCommentHeader(
        "REPLACED CODES",
        "These codes were manually selected for replacement by the end-user configuration file"
      ),
      Array.from(replacedCodes.entries()).map(formatExports).join(""),
    ]
  );
}

if (unusedKeyrune.size) {
  const unused = Array.from(unusedKeyrune);

  await Promise.allSettled(unused.map(writeSVGR));

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
process.exit(0);
