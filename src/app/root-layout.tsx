import { Outlet, useNavigate } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/shared/api/query-client";
import { useCallback, useEffect } from "react";
import { scheduleRefresh, useSession } from "@/shared/model/session";
import { ROUTES } from "@/shared/model/config";
import { RemoteHeader } from "./remote-header";
import { RemoteFooter } from "./remote-footer";

export function RootLayout() {
  const navigate = useNavigate();
  const logout = useSession((state) => state.logout);
  const user = useSession((state) => state.user);

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.LOGIN);
  }, [logout, navigate]);

  useEffect(() => {
    const session = useSession.getState();
    const token = session.token;

    if (token) {
      scheduleRefresh(token);
    }
  }, []);

  // the session can also end outside this component: logout in another tab or a failed refresh
  useEffect(
    () =>
      useSession.subscribe((state, prev) => {
        if (prev.token && !state.token) {
          navigate(ROUTES.LOGIN);
        }
      }),
    [navigate],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RemoteHeader title="Products" userName={user ? `${user.firstName} ${user.lastName}` : ""} image={user ? user.image : ""} onLogout={handleLogout} />
      <Outlet />
      <RemoteFooter title="Products" year={new Date().getFullYear()}/>
    </QueryClientProvider>
  );
}
