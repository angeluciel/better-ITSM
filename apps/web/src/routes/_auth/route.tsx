import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getSession } from "../../lib/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session) throw redirect({ to: "/dashboard" });
  },
  component: () => <Outlet />,
});
