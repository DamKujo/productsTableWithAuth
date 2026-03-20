import Authorization from "@/features/auth/authorization.page";
import ProductsOverview from "@/features/products-overview/products-overview.page";
import { createBrowserRouter, redirect } from "react-router";
import { User } from "@/shared/types/index.type";
import { authFetch } from "../shared/api/authorization.service";
import { RootLayout } from "@/app/root-layout";
import { AuthService, useSession } from "@/shared/model/session";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Authorization,
    loader: publicLoader,
  },
  {
    path: "/",
    Component: RootLayout,
    loader: protectedLoader,
    children: [
      {
        index: true,
        loader: () => redirect("/products"),
      },
      {
        path: "products",
        Component: ProductsOverview,
      },
    ],
  },
]);

async function publicLoader() {
  const session = useSession.getState();
  const token = session.token;

  if (!token?.token.accessToken) return null;

  try {
    await getUser();
    throw redirect("/products");
  } catch {
    return null;
  }
}

async function protectedLoader() {
  const session = useSession.getState();
  const token = session.token;

  if (!token?.token.accessToken) {
    throw redirect("/login");
  }

  return null;
}

async function getUser(): Promise<User> {
  const res = await authFetch("https://dummyjson.com/auth/me", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}
