import type { Meta, StoryObj } from "@storybook/react";

import { View } from "react-native";
import MyButton from "./button";

const meta = {
  title: "MyButton",
  component: MyButton,
  argTypes: {
    onPress: { action: "pressed the button" },
  },
  args: {
    title: "Hello world",
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: "flex-start" }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const AnotherExample: Story = {
  args: {
    title: "Another example",
  },
};
