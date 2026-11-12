import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { http, HttpResponse } from "msw";
import AuthCard from "./auth-card";

const meta = { title: "Auth/AuthCard", component: AuthCard } satisfies Meta<typeof AuthCard>;
export default meta;
type Story = StoryObj<typeof meta>;

// 1. Just the form, no request involved
export const Default: Story = {};

export const WrongPassword: Story = {
  beforeEach({ msw }) {
    msw.use(
      http.post("https://dummyjson.com/auth/login", () =>
        HttpResponse.json({ message: "Invalid credentials" }, { status: 400 }),
      ),
    );
  },
};

export const Success: Story = {
  beforeEach({ msw }) {
    msw.use(
      http.post("https://dummyjson.com/auth/login", () =>
        HttpResponse.json({
          id: 1, username: "demo", email: "demo@example.com",
          firstName: "Demo", lastName: "User", gender: "female", image: "",
          accessToken: "fake-access", refreshToken: "fake-refresh",
        }),
      ),
    );
  },
};