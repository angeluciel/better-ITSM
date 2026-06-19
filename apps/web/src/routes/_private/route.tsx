import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "../../lib/auth";
import { useRedirectStore } from "../../lib/redirect-store";

export const Route = createFileRoute("/_private")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();
    if (!session) {
      useRedirectStore.getState().setNext(location.pathname);
      throw redirect({ to: "/login" });
    }
    return { session };
  },
  component: () => <Outlet />,
});
