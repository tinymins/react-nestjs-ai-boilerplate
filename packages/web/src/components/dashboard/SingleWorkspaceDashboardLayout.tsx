import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Dropdown, Menu, Drawer } from "antd";
import { GlobalOutlined, BulbOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import type { User } from "@acme/types";
import type { Theme, Lang, LangMode, ThemeMode } from "../../lib/types";
import { LANG_NAMES } from "../../lib/types";
import { WorkspaceRedirectSkeleton } from "../../components/skeleton";
import { trpc } from "../../lib/trpc";
import { UserMenu, UserSettingsModal, SystemSettingsModal } from "../account";
import { menuRouteSuffixes } from "./constants";

type SingleWorkspaceDashboardLayoutProps = {
  user: User | null;
  lang: Lang;
  langMode: LangMode;
  theme: Theme;
  themeMode: ThemeMode;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  onChangeLangMode: (mode: LangMode) => void;
  onChangeThemeMode: (mode: ThemeMode) => void;
};

export default function SingleWorkspaceDashboardLayout({
  user,
  lang,
  langMode,
  theme,
  themeMode,
  onUpdateUser,
  onLogout,
  onChangeLangMode,
  onChangeThemeMode,
}: SingleWorkspaceDashboardLayoutProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [systemSettingsOpen, setSystemSettingsOpen] = useState(false);
  const updateProfileMutation = trpc.user.updateProfile.useMutation();

  const handleThemeModeChange = (mode: ThemeMode) => {
    onChangeThemeMode(mode);
    if (user) {
      updateProfileMutation.mutate(
        { settings: { themeMode: mode } },
        { onSuccess: (updatedUser: User) => onUpdateUser(updatedUser) }
      );
    }
  };

  const handleLangModeChange = (mode: LangMode) => {
    onChangeLangMode(mode);
    if (user) {
      updateProfileMutation.mutate(
        { settings: { langMode: mode } },
        { onSuccess: (updatedUser: User) => onUpdateUser(updatedUser) }
      );
    }
  };

  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langItems = Object.entries(LANG_NAMES).map(([key, label]) => ({
    key,
    label
  }));
  langItems.unshift({ key: "auto", label: t("common.auto") });

  const themeItems = [
    { key: "auto", label: t("common.auto") },
    { key: "light", label: t("common.light") },
    { key: "dark", label: t("common.dark") }
  ];
  const location = useLocation();
  const navigate = useNavigate();

  // 获取工作空间列表（需要获取 shared 工作空间的 ID）
  const workspacesQuery = trpc.workspace.list.useQuery();

  const menuItems = [
    ...(t("dashboard.menu", { returnObjects: true }) as string[]),
    t("dashboard.todoList.menuLabel"),
  ];

  const menuItemConfigs = menuItems.map((label, index) => ({
    key: String(index),
    label
  }));

  // 根据当前路径计算激活的菜单索引
  const getActiveIndex = () => {
    const path = location.pathname;
    const basePath = "/dashboard";

    for (let i = menuRouteSuffixes.length - 1; i >= 0; i--) {
      const suffix = menuRouteSuffixes[i];
      if (suffix && path === `${basePath}${suffix}`) {
        return i;
      }
    }
    if (path === basePath || path === `${basePath}/`) {
      return 0;
    }
    return 0;
  };

  const activeIndex = getActiveIndex();

  const handleMenuClick = (index: number) => {
    const suffix = menuRouteSuffixes[index];
    navigate(`/dashboard${suffix}`);
    setMobileMenuOpen(false);
  };

  if (!user) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex h-full items-center justify-center">
          <div className="card max-w-md">
            <h2 className="text-2xl font-semibold">
              {t("dashboard.promptTitle")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-300">
              {t("dashboard.promptBody")}
            </p>
            <Link className="btn mt-4 inline-flex" to="/login">
              {t("dashboard.toLogin")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (workspacesQuery.isLoading) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <WorkspaceRedirectSkeleton />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar - No WorkspaceSwitcher in single mode */}
        <aside className="hidden h-full w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
          {/* App Title instead of workspace switcher */}
          <div className="border-b border-slate-200 dark:border-slate-800 px-4 py-4">
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {t("brand")}
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pt-2 text-sm">
            <Menu
              mode="inline"
              items={menuItemConfigs}
              selectedKeys={[String(activeIndex)]}
              onClick={({ key }) => handleMenuClick(Number(key))}
              className="border-none bg-transparent"
              theme={theme === "dark" ? "dark" : "light"}
              style={{ borderInlineEnd: 'none' }}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 lg:justify-end lg:px-6 lg:py-4 dark:border-slate-800 dark:bg-slate-900">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:!hidden"
            />
            <div className="flex items-center gap-3 text-sm">
              <Dropdown
                trigger={["hover"]}
                menu={{
                  items: langItems,
                  onClick: ({ key }) => handleLangModeChange(key as LangMode)
                }}
              >
                <Button size="middle" shape="circle" type="text" icon={<GlobalOutlined />} />
              </Dropdown>
              <Dropdown
                trigger={["hover"]}
                menu={{
                  items: themeItems,
                  onClick: ({ key }) => handleThemeModeChange(key as ThemeMode)
                }}
              >
                <Button size="middle" shape="circle" type="text" icon={<BulbOutlined />} />
              </Dropdown>
              <UserMenu
                user={user}
                onOpenSettings={() => setSettingsOpen(true)}
                onOpenSystemSettings={() => setSystemSettingsOpen(true)}
                onLogout={onLogout}
              />
              <UserSettingsModal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                user={user}
                langMode={langMode}
                themeMode={themeMode}
                onUpdateUser={onUpdateUser}
                onChangeLangMode={onChangeLangMode}
                onChangeThemeMode={onChangeThemeMode}
              />
              <SystemSettingsModal
                open={systemSettingsOpen}
                onClose={() => setSystemSettingsOpen(false)}
                user={user}
              />
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        className="lg:hidden"
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex h-full flex-col bg-white dark:bg-slate-900">
          <div className="flex justify-end p-2">
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>

          {/* App Title */}
          <div className="border-b border-slate-200 dark:border-slate-800 px-4 py-4">
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {t("brand")}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto pt-2 text-sm">
            <Menu
              mode="inline"
              items={menuItemConfigs}
              selectedKeys={[String(activeIndex)]}
              onClick={({ key }) => handleMenuClick(Number(key))}
              className="border-none bg-transparent"
              theme={theme === "dark" ? "dark" : "light"}
              style={{ borderInlineEnd: 'none' }}
            />
          </nav>
        </div>
      </Drawer>
    </div>
  );
}
