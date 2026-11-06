import { getUser } from "@/shared/api/instance";
import { ROUTES } from "@/shared/model/config";
import { useSession } from "@/shared/model/session";
import { User } from "@/shared/types/index.type";
import { redirect } from "react-router";

export async function publicLoader() {
  const session = useSession.getState();
  const token = session.token;

  if (!token?.token.accessToken) return null;

  let user: User;
  try {
    user = await getUser();
  } catch {
    // token is stale: stay on the login page
    return null;
  }

  session.setUser(user);
  throw redirect(ROUTES.PRODUCTS);
}

export async function protectedLoader() {
  const session = useSession.getState();
  const token = session.token;

  if (!token?.token.accessToken) {
    throw redirect(ROUTES.LOGIN);
  }

  // after a page reload only the token survives (it's in storage), so load the user again
  if (!session.user) {
    try {
      session.setUser(await getUser());
    } catch {
      session.logout();
      throw redirect(ROUTES.LOGIN);
    }
  }

  return null;
}
