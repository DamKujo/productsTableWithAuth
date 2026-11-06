import { commonPostRequest } from "@/shared/api/instance";
import { EXPIRES_AT, URLS } from "@/shared/model/config";
import { useSession } from "@/shared/model/session";
import { LoginResponse, User } from "@/shared/types/index.type";
import { AuthData } from "@/shared/types/schema";
import { UseFormSetError } from "react-hook-form";

// Returns the logged-in user, or null if login failed (the error is set on the form)
export async function useLogin(
  data: AuthData,
  rememberMe: boolean,
  setError: UseFormSetError<{
    login: string;
    password: string;
  }>,
): Promise<User | null> {
  const session = useSession.getState();
  const { login, password } = data;
  try {
    const result = await commonPostRequest(URLS.LOGIN, {
      username: `${login}`,
      password: `${password}`,
    });

    if (!result.ok) {
      throw new Error("Не удалось войти, повторите попытку");
    }
    const { accessToken, refreshToken, ...user }: LoginResponse =
      await result.json();
    const token = {
      accessToken,
      refreshToken,
      expiresAt: String(Date.now() + EXPIRES_AT),
    };

    session.login({ token, type: rememberMe ? "local" : "session" }, user);
    return user;
  } catch (err) {
    setError("root", {
      message: "Login failed. Please check your credentials and try again.",
    });
    return null;
  }
}
