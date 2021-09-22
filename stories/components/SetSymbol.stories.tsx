import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import SetSymbol from "../../components/SetSymbol";

export default {
  title: "Set Symbol",
  component: SetSymbol,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof SetSymbol>;

const Template: ComponentStory<typeof SetSymbol> = (args) => (
  <SetSymbol {...args} />
);

export const Common = Template.bind({});
Common.args = {
  rarity: "common",
  set: "INV",
};

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
