import { useSession } from "@/shared/model/session";

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const session = useSession.getState();
  let token = session.token;
  const authenticate = async (token: string | null) => {
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  };

  let response = await authenticate(token?.token.accessToken!);
  return response;
}
