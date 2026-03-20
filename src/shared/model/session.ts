import { useState } from "react";
import { AuthServiceInterface, AuthTokenInterface } from "../types/index.type";
import { commonPostRequest } from "../api/instance";
import { create } from "zustand";
import { EXPIRES_AT } from "./config";
type SessionState = {
  token: AuthTokenInterface | null;
  login: (token: AuthTokenInterface) => void;
  logout: () => void;
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

  login: (token: AuthTokenInterface) => {
    classAuth.setToken(token);
    set({ token });
    scheduleRefresh(token);
  },

  logout: () => {
    const { token } = get();
    new AuthService().removeToken(token?.type!);
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    set({ token: null });
  },

  refreshToken: async () => {
    const { token } = get();

    if (!token) throw new Error("No token");

    const result = await commonPostRequest(
      "https://dummyjson.com/auth/refresh",
      {
        refreshToken: token.token.refreshToken,
      },
    );

    if (!result.ok) {
      classAuth.removeToken(token.type);

      set({ token: null });
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
