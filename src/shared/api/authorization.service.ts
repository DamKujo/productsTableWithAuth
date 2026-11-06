import { useSession } from "@/shared/model/session";

// One refresh at a time: concurrent 401s (e.g. from several MFEs) wait for the same request
let refreshing: Promise<unknown> | null = null;

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const send = () => {
    const accessToken = useSession.getState().token?.token.accessToken;
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
  };

  const response = await send();
  if (response.status !== 401 || !useSession.getState().token) {
    return response;
  }

  refreshing ??= useSession
    .getState()
    .refreshToken()
    .finally(() => {
      refreshing = null;
    });

  try {
    await refreshing;
  } catch {
    // refresh failed: the session is already cleared, hand back the original 401
    return response;
  }
  return send();
}
