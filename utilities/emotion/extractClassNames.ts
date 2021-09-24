import type { SerializedStyles, ClassNamesContent } from "@emotion/react";

export type SerializedStyleMap<T extends Record<string, unknown>> = {
  [k in string & keyof T]: SerializedStyles;
};

export type StringStyleMap<T extends Record<string, unknown>> = {
  [k in string & keyof T]: string;
};

export const extractClassNames = (
  css: ClassNamesContent["css"],
  input: SerializedStyleMap<Record<string, unknown>>
) =>
  Object.entries(input).reduce(
    (output: StringStyleMap<typeof input>, [name, declaration]) => {
      output[name] = css(declaration);

      return output;
    },
    {}
  );

export default extractClassNames;
