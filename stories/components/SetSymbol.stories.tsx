import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import RarityGradientSVG from "../../components/RarityGradientSVG";
import SetSymbol from "../../components/SetSymbol";

export default {
  title: "Set Symbol",
  component: SetSymbol,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof SetSymbol>;

interface TemplateConfig {
  args: Record<string, unknown>;
  template: ComponentStory<typeof SetSymbol>;
}

const singleSet: TemplateConfig = {
  args: {
    set: "STH",
    rarity: "common",
  },
  template: (args) => (
    <>
      <RarityGradientSVG />
      <SetSymbol {...args} />
    </>
  ),
};

const TemplateMultiple: ComponentStory<typeof SetSymbol> = (args) => (
  <>
    <RarityGradientSVG />
    <SetSymbol {...args} />
  </>
);

export const Basic = TemplateSingleSet.bind({});
Basic.args = {
  set: "INV",
  rarity: "common",
};

export const Rarities = TemplateSingleSet.bind({});
Rarities.args = {
  set: "STH",
  rarity: "common",
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
