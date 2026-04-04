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
  const registrationStatusQuery = authApi.registrationStatus.useQuery({
    staleTime: 30_000,
  });

  const invitationCode = searchParams.get("invite") ?? "";
  const hasValidInvitation = invitationCode.length > 0;
  const registrationAllowed = registrationStatusQuery.data?.allowed ?? false;
  const isFirstUser = registrationStatusQuery.data?.isFirstUser ?? false;

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const error = (
    mode === "login" ? loginMutation.error : registerMutation.error
  )?.message;
  const isPending = loginMutation.isPending || registerMutation.isPending;
  const redirect = searchParams.get("redirect");
  const didNavigate = useRef(false);
  const didAutoSwitch = useRef(false);

  // Auto-switch to register if invitation code is present
  useEffect(() => {
    if (
      hasValidInvitation &&
      initialMode === "login" &&
      !didAutoSwitch.current
    ) {
      didAutoSwitch.current = true;
      setMode("register");
    }
  }, [hasValidInvitation, initialMode]);

  useEffect(() => {
    if (!isLoading && isAuthed && !didNavigate.current) {
      navigate(redirect || "/dashboard");
    }
  }, [isAuthed, isLoading, navigate, redirect]);

  useEffect(() => {
    setMode(initialMode);
    setEmail("");
    setPassword("");
    setName("");
  }, [initialMode]);

  if (isLoading || registrationStatusQuery.isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-base)]">
        <p className="text-[var(--text-muted)]">{t("login.loading")}</p>
      </div>
    );
  }

  // Registration disabled and user is on register page without invitation
  const registrationBlocked =
    mode === "register" &&
    !registrationAllowed &&
    !hasValidInvitation &&
    !isFirstUser;

  const canShowSwitchButton =
    mode === "login"
      ? registrationAllowed || hasValidInvitation || isFirstUser
      : true;

  const subtitle = (() => {
    if (mode === "login") return t("login.pleaseLogin");
    if (isFirstUser) return t("login.firstAdmin");
    if (hasValidInvitation) return t("login.invitedRegister");
    return "";
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      const result = await loginMutation.mutateAsync({ email, password });
      login(result.user as User);
      didNavigate.current = true;
      if (singleWorkspaceMode) {
        navigate(redirect || "/dashboard/shared");
      } else {
        navigate(redirect || `/dashboard/${result.defaultWorkspaceSlug}`);
      }
    } else {
      const result = await registerMutation.mutateAsync({
        name: name.trim(),
        email,
        password,
        invitationCode: invitationCode || undefined,
      });
      login(result.user as User);
      didNavigate.current = true;
      if (singleWorkspaceMode) {
        navigate(redirect || "/dashboard/shared");
      } else {
        navigate(redirect || `/dashboard/${result.defaultWorkspaceSlug}`);
      }
    }
  };

  const switchMode = () => {
    const next = mode === "login" ? "register" : "login";
    setMode(next);
    setEmail("");
    setPassword("");
    setName("");
    const q = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";
    const inviteQ = invitationCode
      ? `${q ? "&" : "?"}invite=${encodeURIComponent(invitationCode)}`
      : "";
    navigate(next === "login" ? `/login${q}` : `/register${q}${inviteQ}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 bg-[var(--bg-base)]">
      <div className="aurora-bg" />
      <div className="w-full max-w-sm z-10">
        <div className="glass glass-accent p-8">
          <h1 className="text-xl font-semibold mb-1 text-[var(--text-primary)]">
            {mode === "login" ? t("login.login") : t("login.register")}
          </h1>
          {subtitle && (
            <p className="text-sm text-[var(--text-muted)] mb-5">{subtitle}</p>
          )}
          {!subtitle && <div className="mb-5" />}

          {registrationBlocked ? (
            <div className="space-y-4">
              <p
                className="rounded-md border px-3 py-2 text-sm
                  text-[var(--accent-text)] bg-[var(--accent-subtle)]
                  border-[var(--accent-text)]"
              >
                {t("login.registrationDisabled")}
              </p>
              <button
                type="button"
                onClick={switchMode}
                className="cursor-pointer w-full text-sm hover:underline text-[var(--text-muted)]"
              >
                {t("login.backToLogin")}
              </button>
            </div>
          ) : (
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

              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    {t("login.name")}
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("login.namePlaceholder")}
                    required
                  />
                </div>
              )}

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

              {canShowSwitchButton && (
                <button
                  type="button"
                  onClick={switchMode}
                  className="cursor-pointer w-full text-sm hover:underline text-[var(--text-muted)]"
                >
                  {mode === "login"
                    ? t("login.noAccountRegister")
                    : t("login.haveAccountLogin")}
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
