import { Outlet } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/shared/api/query-client";
import { useEffect } from "react";
import { scheduleRefresh, useSession } from "@/shared/model/session";
import { AuthTokenInterface } from "@/shared/types/index.type";

export function RootLayout() {
  useEffect(() => {
    const session = useSession.getState();
    const token = session.token;

    if (token) {
      scheduleRefresh(token);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Outlet />
    </QueryClientProvider>
  );
}
