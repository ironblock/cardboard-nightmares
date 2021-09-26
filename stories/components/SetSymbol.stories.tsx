import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import RarityGradientSVG from "../../components/RarityGradientSVG";
import SetSymbol from "../../components/SetSymbol";
import { SetsByReleaseDate } from "../../constants/MTGJSON/Sets";

export default {
  title: "Set Symbol",
  component: SetSymbol,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof SetSymbol>;

const singleSet: ComponentStory<typeof SetSymbol> = (args) => (
  <>
    <RarityGradientSVG />
    <SetSymbol {...args} />
  </>
);

const allSets: ComponentStory<typeof SetSymbol> = (args) => (
  <>
    <RarityGradientSVG />
    <table>
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
            sets.map((set) => (
              <tr key={set.code}>
                <td>{set.name}</td>
                <td>{set.releaseDate}</td>
                <td>
                  <SetSymbol set={set.code} rarity="common" />
                </td>
                <td>
                  <SetSymbol set={set.code} rarity="uncommon" />
                </td>
                <td>
                  <SetSymbol set={set.code} rarity="rare" />
                </td>
                <td>
                  <SetSymbol set={set.code} rarity="mythic" />
                </td>
                <td>
                  <SetSymbol set={set.code} rarity="timeshifted" />
                </td>
              </tr>
            ))
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
AllSets.args = {};

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
