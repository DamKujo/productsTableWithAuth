import { authFetch } from "@/shared/api/authorization.service";
import { AUTH_CHANGED_EVENT, useSession } from "@/shared/model/session";
import { User } from "@/shared/types/index.type";

// The only part of the session that remotes see. The shell passes this object
// to every remote in mount(); remotes never touch tokens or storage directly.
// Plain JS on purpose: React, Vue or any other remote can use it.
export type SessionApi = {
  getUser: () => User | null;
  // returns an unsubscribe function
  subscribe: (listener: (user: User | null) => void) => () => void;
  logout: () => void;
  // fetch with the access token attached; refreshes the token on 401
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  // name of the window event fired on user changes
  changedEvent: string;
};

export const sessionApi: SessionApi = {
  getUser: () => useSession.getState().user,
  subscribe: (listener) =>
    useSession.subscribe((state, prev) => {
      if (state.user !== prev.user) listener(state.user);
    }),
  logout: () => useSession.getState().logout(),
  authFetch,
  changedEvent: AUTH_CHANGED_EVENT,
};
