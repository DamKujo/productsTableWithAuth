import {
  AuthServiceInterface,
  AuthTokenInterface,
  User,
} from "../types/index.type";
import { commonPostRequest } from "../api/instance";
import { create } from "zustand";
import { EXPIRES_AT, URLS } from "./config";
type SessionState = {
  token: AuthTokenInterface | null;
  // not persisted: after a reload it's fetched again by protectedLoader
  user: User | null;
  login: (token: AuthTokenInterface, user: User) => void;
  setUser: (user: User) => void;
  // broadcast: false when the logout came from another tab, so we don't echo it back
  logout: (options?: { broadcast?: boolean }) => void;
  refreshToken: () => Promise<AuthTokenInterface>;
};

export class AuthService implements AuthServiceInterface {
  setToken({ token, type }: AuthTokenInterface): void {
    if (type === "local") {
      localStorage.setItem("accessToken", token.accessToken);
      localStorage.setItem("refreshToken", token.refreshToken);
      localStorage.setItem("expiresAt", String(token.expiresAt));
    } else if (type === "session") {
      sessionStorage.setItem("accessToken", token.accessToken);
      sessionStorage.setItem("refreshToken", token.refreshToken);
      sessionStorage.setItem("expiresAt", String(token.expiresAt));
    }
  }
  getToken(): AuthTokenInterface | null {
    const localToken = {
      accessToken: localStorage.getItem("accessToken")!,
      refreshToken: localStorage.getItem("refreshToken")!,
      expiresAt: localStorage.getItem("expiresAt")!,
    };
    const sessionToken = {
      accessToken: sessionStorage.getItem("accessToken")!,
      refreshToken: sessionStorage.getItem("refreshToken")!,
      expiresAt: sessionStorage.getItem("expiresAt")!,
    };
    if (
      localStorage.getItem("accessToken") &&
      sessionStorage.getItem("accessToken")
    ) {
      return null;
    }
    return {
      token: localStorage.getItem("accessToken") ? localToken : sessionToken,
      type: localStorage.getItem("accessToken") ? "local" : "session",
    };
  }
  removeToken(type: string): void {
    if (type === "local") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("expiresAt");
    } else if (type === "session") {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("expiresAt");
    }
  }
}

export function scheduleRefresh(token: AuthTokenInterface) {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  let expiresAt = token.token.expiresAt;

  const delay = Number(expiresAt) - Date.now() - 60000;

  if (delay <= 0) return;

  refreshTimeout = setTimeout(() => {
    useSession.getState().refreshToken();
  }, delay);
}

const classAuth = new AuthService();

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

export const useSession = create<SessionState>((set, get) => ({
  token: classAuth.getToken(),
  user: null,

  login: (token: AuthTokenInterface, user: User) => {
    classAuth.setToken(token);
    set({ token, user });
    scheduleRefresh(token);
  },

  setUser: (user: User) => {
    set({ user });
  },

  logout: ({ broadcast = true } = {}) => {
    const { token } = get();
    new AuthService().removeToken(token?.type!);
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    set({ token: null, user: null });
    if (broadcast) {
      authChannel?.postMessage({ type: "logout" });
    }
  },

  refreshToken: async () => {
    const { token } = get();

    if (!token) throw new Error("No token");

    const result = await commonPostRequest(URLS.REFRESH, {
      refreshToken: token.token.refreshToken,
    });

    if (!result.ok) {
      classAuth.removeToken(token.type);

      set({ token: null, user: null });
      throw new Error("Refresh failed");
    }

    const data = await result.json();

    const newToken = {
      token: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: String(Date.now() + EXPIRES_AT),
      },
      type: token.type,
    };

    classAuth.setToken(newToken);

    set({ token: newToken });

    scheduleRefresh(newToken);

    return newToken;
  },
}));

// Fired on window whenever the user changes (login, user loaded, logout).
// Remotes can listen to it, but should read the current user via the session API:
// an event fired before a remote mounted is lost
export const AUTH_CHANGED_EVENT = "auth:changed";

useSession.subscribe((state, prev) => {
  if (state.user !== prev.user) {
    window.dispatchEvent(
      new CustomEvent(AUTH_CHANGED_EVENT, { detail: { user: state.user } }),
    );
  }
});

// Cross-tab sync: logging out in one tab logs out every other tab
const authChannel =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("auth") : null;

authChannel?.addEventListener("message", (event: MessageEvent) => {
  if (event.data?.type === "logout" && useSession.getState().token) {
    useSession.getState().logout({ broadcast: false });
  }
});
