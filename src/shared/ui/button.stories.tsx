import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Button } from "./button";

const meta = {
    title: "Shared/Button",
    component: Button,
    args: { children: "Enter"},
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Large: Story = { args: { size: "lg" } };