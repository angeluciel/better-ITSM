import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRedirectStore } from "../../lib/redirect-store";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const consumeNext = useRedirectStore((s) => s.consumeNext);

  async function handleLogin() {
    // TODO: real auth here
    const next = consumeNext() ?? "/dashboard";
    navigate({ to: next });
  }

  return (
    <div>
      login page
      <button onClick={handleLogin}>Log in</button>
    </div>
  );
}
