import { Button, Input } from "@acme/components";
import type { User } from "@acme/types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { authApi } from "@/generated/rust-api";
import { useAuth, useSystemSettings } from "@/hooks";

type LoginPageProps = {
  initialMode?: "login" | "register";
};

export default function AuthPage({ initialMode = "login" }: LoginPageProps) {
  const { t } = useTranslation();
  const { login, isAuthed, isLoading } = useAuth();
  const { singleWorkspaceMode } = useSystemSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginMutation = authApi.login.useMutation();
  const registerMutation = authApi.register.useMutation();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const error = (
    mode === "login" ? loginMutation.error : registerMutation.error
  )?.message;
  const isPending = loginMutation.isPending || registerMutation.isPending;
  const redirect = searchParams.get("redirect");
  // Prevent redirect-effect from firing when handleSubmit already navigated.
  const didNavigate = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthed && !didNavigate.current) {
      navigate(redirect || "/dashboard");
    }
  }, [isAuthed, isLoading, navigate, redirect]);

  useEffect(() => {
    setMode(initialMode);
    setEmail("");
    setPassword("");
  }, [initialMode]);

  if (isLoading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mutation = mode === "login" ? loginMutation : registerMutation;
    const result = await mutation.mutateAsync({ email, password });
    login(result.user as User);
    didNavigate.current = true;
    if (singleWorkspaceMode) {
      navigate(redirect || "/dashboard/shared");
    } else {
      navigate(redirect || `/dashboard/${result.defaultWorkspaceSlug}`);
    }
  };

  const switchMode = () => {
    const next = mode === "login" ? "register" : "login";
    setMode(next);
    setEmail("");
    setPassword("");
    const q = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";
    navigate(next === "login" ? `/login${q}` : `/register${q}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 bg-[var(--bg-base)]">
      <div className="aurora-bg" />
      <div className="w-full max-w-sm z-10">
        <div className="glass glass-accent p-8">
          <h1 className="text-xl font-semibold mb-6 text-[var(--text-primary)]">
            {mode === "login" ? t("login.login") : t("login.register")}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                {t("login.email")}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="me@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                {t("login.password")}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p
                className="rounded-md border px-3 py-2 text-sm
                  text-[var(--accent-text)] bg-[var(--accent-subtle)]
                  border-[var(--accent-text)]"
              >
                {error}
              </p>
            )}

            <Button type="submit" block loading={isPending} className="mt-1">
              {mode === "login" ? t("login.login") : t("login.register")}
            </Button>

            <button
              type="button"
              onClick={switchMode}
              className="cursor-pointer w-full text-sm hover:underline text-[var(--text-muted)]"
            >
              {mode === "login"
                ? t("login.noAccountRegister")
                : t("login.haveAccountLogin")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
