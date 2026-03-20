import { getUser } from "@/shared/api/instance";
import { useSession } from "@/shared/model/session";
import { redirect } from "react-router";

export async function publicLoader() {
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

export async function protectedLoader() {
  const session = useSession.getState();
  const token = session.token;

  if (!token?.token.accessToken) {
    throw redirect("/login");
  }

  return null;
}
