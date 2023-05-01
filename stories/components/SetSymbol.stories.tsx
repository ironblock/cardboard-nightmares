import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import SetSymbol from "../../components/SetSymbol";
import SetSymbolDefsSVG from "../../components/SetSymbolDefsSVG";
import {
  noMythicRares,
  noRarityColors,
  eighthEditionToM15,
  SetsByReleaseDate,
} from "../../constants/MTGJSON/Sets";

export default {
  title: "Set Symbol",
  component: SetSymbol,
  argTypes: {},
} as ComponentMeta<typeof SetSymbol>;

const singleSet: ComponentStory<typeof SetSymbol> = (args) => (
  <>
    <SetSymbolDefsSVG />
    <SetSymbol {...args} />
  </>
);

const allSets: ComponentStory<typeof SetSymbol> = (args) => (
  <>
    <SetSymbolDefsSVG />
    <table style={{ textAlign: "center" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Release</th>
          <th>Common</th>
          <th>Uncommon</th>
          <th>Rare</th>
          <th>Mythic</th>
          <th>Timeshifted</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(SetsByReleaseDate)
          .sort(([dateA], [dateB]) => (dateA > dateB ? 1 : -1))
          .map(([key, sets]) =>
            sets.map((set) => {
              const commonProps = {
                eigthEditionToM15: eighthEditionToM15.has(set.code),
                set: set.code,
                original: args.original,
              };

              return (
                <tr key={set.code}>
                  <td>{set.name}</td>
                  <td>{set.releaseDate}</td>
                  <td>
                    <SetSymbol {...commonProps} rarity="common" />
                  </td>
                  {args.original && noRarityColors.has(set.code) ? (
                    <>
                      <td>--</td>
                      <td>--</td>
                    </>
                  ) : (
                    <>
                      <td>
                        <SetSymbol {...commonProps} rarity="uncommon" />
                      </td>
                      <td>
                        <SetSymbol {...commonProps} rarity="rare" />
                      </td>
                    </>
                  )}

                  {args.original && noMythicRares.has(set.code) ? (
                    <>
                      <td>--</td>
                    </>
                  ) : (
                    <td>
                      <SetSymbol {...commonProps} rarity="mythic" />
                    </td>
                  )}
                  <td>
                    <SetSymbol {...commonProps} rarity="timeshifted" />
                  </td>
                </tr>
              );
            })
          )
          .flat()}
      </tbody>
    </table>
  </>
);

export const Basic = singleSet.bind({});
Basic.args = {
  set: "INV",
  rarity: "common",
};

export const Rarities = singleSet.bind({});
Rarities.args = {
  set: "STH",
  rarity: "common",
};

export const AllSets = allSets.bind({});
AllSets.args = {
  original: true,
};
AllSets.parameters = { controls: { include: ["original"] } };

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: "Button",
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: "large",
//   label: "Button",
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: "small",
//   label: "Button",
// };
