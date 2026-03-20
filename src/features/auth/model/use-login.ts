import { commonPostRequest } from "@/shared/api/instance";
import { EXPIRES_AT, URLS } from "@/shared/model/config";
import { useSession } from "@/shared/model/session";
import { AuthData } from "@/shared/types/schema";
import { UseFormSetError } from "react-hook-form";

export async function useLogin(
  data: AuthData,
  rememberMe: boolean,
  setError: UseFormSetError<{
    login: string;
    password: string;
  }>,
) {
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
    const data = await result.json();
    const token = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: String(Date.now() + EXPIRES_AT),
    };
    if (rememberMe) {
      session.login({
        token: token,
        type: "local",
      });
    } else {
      session.login({
        token: token,
        type: "session",
      });
    }

    return data;
  } catch (err) {
    setError("root", {
      message: "Login failed. Please check your credentials and try again.",
    });
    return;
  }
}
