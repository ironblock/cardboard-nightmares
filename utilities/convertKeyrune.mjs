#!/usr/bin/node
import fs from "fs";

import svgrCore from "@svgr/core";
import { ESLint } from "eslint";

const svgr = svgrCore.default;

console.time("Finished in");
console.log("Converting Keyrune SVG files...\n");

const cacheDir = new URL("../cache/", import.meta.url);
const directory = {
  MTGJSON: new URL("./MTGJSON/", cacheDir),
  SVGR: new URL("./SVGR/", cacheDir),
  Keyrune: new URL("../node_modules/keyrune/svg/", import.meta.url),
};

const SetList = JSON.parse(
  fs.readFileSync(new URL("./SetList.json", directory.MTGJSON))
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
};

const formatName = ({ keyruneCode, name, code }) =>
  `${
    keyruneCode && keyruneCode !== "DEFAULT" ? `${keyruneCode}: ` : ""
  }"${name} (${code})"`;

const defaultCodes = new Map();
const missingCodes = new Map();
const foundCodes = new Map();

await Promise.all(
  SetList.data.map(async (set) => {
    const { keyruneCode, code, name } = set;
    const keyruneSourcePath = new URL(
      `${keyruneCode.toLowerCase()}.svg`,
      directory.Keyrune
    );

    try {
      const jsonStats = await fs.promises.lstat(keyruneSourcePath);
    } catch (error) {
      if (keyruneCode === "DEFAULT") {
        defaultCodes.set(code, { keyruneCode, name, code });
      } else {
        missingCodes.set(keyruneCode, { keyruneCode, name, code });
      }
      return null;
    }

    try {
      const svgOutputPath = new URL(
        `${keyruneCode.toUpperCase()}.tsx`,
        directory.SVGR
      );
      const svgCode = await fs.promises.readFile(keyruneSourcePath);

      const component = await svgr(svgCode, options, {
        componentName: `Keyrune${keyruneCode}`,
      });

      await fs.promises.writeFile(svgOutputPath, component);
      foundCodes.set(keyruneCode, { keyruneCode, name, code });
    } catch (error) {
      console.error(error);
      missingCodes.set(keyruneCode, { keyruneCode, name, code });
    }
  })
);

let indexFile = `/** GENERATED FILE! DO NOT EDIT! */

/**
 * KEYRUNE CODES
 */
${Array.from(foundCodes.values())
  .map(
    ({ keyruneCode, name, code }) => `
/** ${formatName({ keyruneCode, name, code })} */
export { ${
      keyruneCode !== code
        ? `default as SVG${keyruneCode}, default as SVG${code}`
        : `default as SVG${keyruneCode}`
    } } from "./${keyruneCode}";`
  )
  .join("")}

/**
 * DEFAULT
 */
export { default as SVGDEFAULT } from "./BCORE";
`;

if (defaultCodes.size) {
  console.info(
    [
      'MTJSON specified the following sets should use "DEFAULT" Keyrune icons.',
      'These will use "Blank Core Set":',
      ...Array.from(defaultCodes.values()).map(
        ({ keyruneCode, name, code }) =>
          `  - ${formatName({ keyruneCode, name, code })}`
      ),
      "\n",
    ].join("\n")
  );

  indexFile += `export {${Array.from(defaultCodes.values())
    .map(
      ({ keyruneCode, name, code }) => `
  /** ${formatName({ keyruneCode, name, code })} */
  default as SVG${code},`
    )
    .join("")}
} from "./BCORE";
`;
}

if (missingCodes.size) {
  console.warn(
    [
      "MTGJSON specified the following non-existent Keyrune codes.",
      'These will fall back to "Blank Core Set":',
      ...Array.from(missingCodes.values()).map(
        ({ keyruneCode, name, code }) =>
          `  - ${formatName({ keyruneCode, name, code })}`
      ),
      "\n",
    ].join("\n")
  );

  indexFile += `
/**
 * MISSING CODES
 * These codes were specified by MTGJSON, but not actually found in the
 * Keyrune repository.
 */
export {${Array.from(missingCodes.values())
    .map(
      ({ keyruneCode, name, code }) => `
  /** ${formatName({ keyruneCode, name, code })} */
  default as SVG${code},`
    )
    .join("")}
} from "./BCORE";
`;
}

await fs.promises.writeFile(new URL("index.tsx", directory.SVGR), indexFile);

process.exit();
