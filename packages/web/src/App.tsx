import { useMemo } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { App as AntdApp } from "antd";
import { TRPCClientError } from "@trpc/client";
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { useAuth, useThemeContext, useLang } from "./hooks";
import type { User } from "@acme/types";
import i18n from "./lib/i18n";
import { saveUser } from "./lib/storage";
import { trpc } from "./lib/trpc";
import { SiteLayout, HomePage } from "./components/site";
import { DashboardLayout, SingleWorkspaceDashboardLayout } from "./components/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  WorkspacePage,
  DashboardIndexRedirect,
  RequirementsPage,
  TestRequirementsPage,
  TestPlanPage,
  TestDesignPage,
  ExecutionPage,
  DefectsPage,
  ReportsPage,
  AutomationPage,
  SettingsPage,
  TodoListPage,
  LoginPage,
  RegisterPage,
  NotFoundPage,
  DashboardNotFoundPage,
  UnauthorizedPage,
} from "./pages";

// Dashboard child routes (shared between both modes)
const dashboardChildRoutes = (user: User | null) => [
  <Route key="index" index element={<WorkspacePage user={user} />} />,
  <Route key="requirements" path="requirements" element={<RequirementsPage />} />,
  <Route key="test-requirements" path="test-requirements" element={<TestRequirementsPage />} />,
  <Route key="test-plan" path="test-plan" element={<TestPlanPage />} />,
  <Route key="test-design" path="test-design" element={<TestDesignPage />} />,
  <Route key="execution" path="execution" element={<ExecutionPage />} />,
  <Route key="defects" path="defects" element={<DefectsPage />} />,
  <Route key="reports" path="reports" element={<ReportsPage />} />,
  <Route key="automation" path="automation" element={<AutomationPage />} />,
  <Route key="settings" path="settings" element={<SettingsPage />} />,
  <Route key="todulist" path="todulist" element={<TodoListPage />} />,
  <Route key="not-found" path="*" element={<DashboardNotFoundPage />} />,
];

// Inner component that uses App.useApp() for message API
function AppContent() {
  const { user, isAuthed, login, updateUser, logout } = useAuth();
  const { theme, themeMode, setThemeMode } = useThemeContext();
  const { lang, langMode, setLangMode } = useLang();

  // Query system settings to determine routing mode
  const systemSettingsQuery = trpc.auth.systemSettings.useQuery();
  const singleWorkspaceMode = systemSettingsQuery.data?.singleWorkspaceMode ?? false;

  const handleLogin = (nextUser: User) => {
    login(nextUser);
    if (nextUser.settings?.themeMode) {
      setThemeMode(nextUser.settings.themeMode);
    }
    if (nextUser.settings?.langMode) {
      setLangMode(nextUser.settings.langMode);
    }
  };

  const dashboardLayoutProps = {
    user,
    lang,
    langMode,
    theme,
    themeMode,
    onUpdateUser: updateUser,
    onLogout: logout,
    onChangeLangMode: setLangMode,
    onChangeThemeMode: setThemeMode,
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            element={
              <SiteLayout
                user={user}
                theme={theme}
                themeMode={themeMode}
                lang={lang}
                langMode={langMode}
                onUpdateUser={updateUser}
                onLogout={logout}
                onChangeLangMode={setLangMode}
                onChangeThemeMode={setThemeMode}
              />
            }
          >
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route element={<ProtectedRoute isAuthed={isAuthed} />}>
            {singleWorkspaceMode ? (
              <>
                {/* 单一空间模式：URL 不包含 workspace 参数 */}
                <Route
                  path="/dashboard"
                  element={<SingleWorkspaceDashboardLayout {...dashboardLayoutProps} />}
                >
                  {dashboardChildRoutes(user)}
                </Route>
                {/* 兼容旧 URL，重定向到不带 workspace 的路径 */}
                <Route path="/dashboard/:workspace/*" element={<Navigate to="/dashboard" replace />} />
              </>
            ) : (
              <>
                {/* 正常模式：URL 包含 workspace 参数 */}
                <Route path="/dashboard" element={<DashboardIndexRedirect />} />
                <Route
                  path="/dashboard/:workspace"
                  element={<DashboardLayout {...dashboardLayoutProps} />}
                >
                  {dashboardChildRoutes(user)}
                </Route>
              </>
            )}
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
  );
}

// Outer App component with all providers
export default function App({ trpcClient }: { trpcClient: ReturnType<typeof trpc.createClient> }) {
  const { message } = AntdApp.useApp();

  const isAuthPage = () =>
    typeof window !== "undefined" &&
    ["/login", "/register"].includes(window.location.pathname);

  const redirectToLogin = () => {
    if (typeof window === "undefined") return;
    if (isAuthPage()) return;
    const redirect = `${window.location.pathname}${window.location.search}`;
    const params = new URLSearchParams({ redirect });
    window.location.assign(`/login?${params.toString()}`);
  };

  const redirectToUnauthorized = () => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/unauthorized") return;
    window.location.assign("/unauthorized");
  };

  const handleTrpcError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      const code = error.data?.code;
      if (code === "UNAUTHORIZED") {
        saveUser(null);
        message.error({
          content: error.message || i18n.t("errors.common.unauthorized"),
          key: "auth-error"
        });
        redirectToLogin();
        return;
      }
      if (code === "FORBIDDEN") {
        message.error({
          content: error.message || i18n.t("errors.common.forbidden"),
          key: "auth-error"
        });
        redirectToUnauthorized();
        return;
      }
      message.error({
        content: error.message || i18n.t("errors.common.requestFailed"),
        key: "trpc-error"
      });
      return;
    }

    if (error instanceof Error) {
      message.error({
        content: error.message || i18n.t("errors.common.requestFailed"),
        key: "trpc-error"
      });
    }
  };

  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleTrpcError
        }),
        mutationCache: new MutationCache({
          onError: handleTrpcError
        }),
        defaultOptions: {
          queries: {
            retry: 1
          }
        }
      }),
    [message]
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <AppContent />
    </trpc.Provider>
  );
}
