import { createBrowserRouter, redirect } from "react-router-dom";
import { RootLayout } from "@/app/root-layout";
import { ROUTES } from "@/shared/model/config";
import { protectedLoader, publicLoader } from "./protected-route";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    lazy: async () => {
      const { default: Component } =
        await import("@/features/auth/authorization.page");
      return { Component };
    },
    loader: publicLoader,
  },
  {
    path: ROUTES.ROOT,
    Component: RootLayout,
    loader: protectedLoader,
    children: [
      {
        index: true,
        loader: () => redirect(ROUTES.PRODUCTS),
      },
      {
        // "/*": nested paths belong to the products remote
        path: `${ROUTES.PRODUCTS}/*`,
        lazy: async () => {
          const { default: Component } = await import("@/app/remote-products");
          return { Component };
        },
      },
    ],
  },
]);
