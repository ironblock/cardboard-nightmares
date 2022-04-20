import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import SetSymbol from "../../components/SetSymbol";
import SetSymbolDefsSVG from "../../components/SetSymbolDefsSVG";
import { SetsByReleaseDate } from "../../constants/MTGJSON/Sets";

export default {
  title: "All Set Symbols",
  component: SetSymbol,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof SetSymbol>;

const allSets: ComponentStory<typeof SetSymbol> = (args) => (
  <>
    <SetSymbolDefsSVG />
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Release Date</th>
          <th>Common</th>
          <th>Uncommon</th>
          <th>Rare</th>
          <th>Mythic</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(SetsByReleaseDate)
          .sort(([dateA], [dateB]) => (dateA > dateB ? 1 : -1))
          .map(([key, sets]) =>
            sets.map((set) => (
              <tr key={set.code}>
                <td>Name</td>
                <td>Release Date</td>
                <td>Common</td>
                <td>Uncommon</td>
                <td>Rare</td>
                <td>Mythic</td>
              </tr>
            ))
          )
          .flat()}
      </tbody>
    </table>
    <SetSymbol {...args} />
  </>
);

export const AllSets = allSets.bind({});
AllSets.args = {};
