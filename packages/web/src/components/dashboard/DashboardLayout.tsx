import type { User } from "@acme/types";
import {
  BulbOutlined,
  CloseOutlined,
  GlobalOutlined,
  MenuOutlined,
  PlusOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Button, Drawer, Dropdown, Menu } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { WorkspaceRedirectSkeleton } from "../../components/skeleton";
import { getAvatarColor } from "../../lib/avatar";
import { trpc } from "../../lib/trpc";
import type { Lang, LangMode, Theme, ThemeMode } from "../../lib/types";
import { LANG_NAMES } from "../../lib/types";
import { WorkspaceNotFoundPage } from "../../pages";
import { SystemSettingsModal, UserMenu, UserSettingsModal } from "../account";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

type DashboardLayoutProps = {
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

type Workspace = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  ownerId?: string | null;
  createdAt?: string;
};

// Workspace Switcher Component
function WorkspaceSwitcher({
  workspaces,
  currentWorkspace,
  onSwitch,
  onOpenCreate,
}: {
  workspaces: Workspace[];
  currentWorkspace?: string;
  onSwitch: (slug: string) => void;
  onOpenCreate: () => void;
}) {
  const { t } = useTranslation();
  const current = workspaces.find((ws) => ws.slug === currentWorkspace);
  const initial = current?.name?.charAt(0).toUpperCase() ?? "W";
  const avatarColor = getAvatarColor(current?.name ?? "Workspace");

  const workspaceMenuItems: MenuProps["items"] = [
    {
      key: "header",
      type: "group",
      label: (
        <div className="px-1 py-2">
          <div className="flex items-center gap-3">
            <Avatar
              size={48}
              style={{
                backgroundColor: avatarColor,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {initial}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {current?.name ?? t("dashboard.noWorkspaceSelected")}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-0.5 text-xs font-medium text-white">
                  FREE
                </span>
                <span className="text-xs text-slate-400">/{current?.slug}</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "switch-title",
      type: "group",
      label: t("dashboard.workspaceSwitcher.switchWorkspace"),
      children: workspaces.map((ws) => ({
        key: ws.slug,
        label: (
          <div className="flex items-center gap-2">
            <Avatar
              size={24}
              style={{ backgroundColor: getAvatarColor(ws.name), fontSize: 12 }}
            >
              {ws.name.charAt(0).toUpperCase()}
            </Avatar>
            <span className={ws.slug === currentWorkspace ? "font-medium" : ""}>
              {ws.name}
            </span>
            {ws.slug === currentWorkspace && (
              <svg
                className="ml-auto h-4 w-4 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ),
      })),
    },
    { type: "divider" },
    {
      key: "create",
      icon: <PlusOutlined />,
      label: t("createWorkspace.title"),
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "create") {
      onOpenCreate();
      return;
    }
    if (workspaces.some((ws) => ws.slug === key)) {
      onSwitch(key);
    }
  };

  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <Dropdown
        menu={{ items: workspaceMenuItems, onClick: handleMenuClick }}
        trigger={["hover"]}
        placement="bottomRight"
        classNames={{ root: "workspace-switcher-dropdown" }}
      >
        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: avatarColor }}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
              {current?.name ?? t("dashboard.noWorkspaceSelected")}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                FREE
              </span>
            </div>
          </div>
          <SwapOutlined className="text-slate-400" />
        </button>
      </Dropdown>
    </div>
  );
}

import {
  findMenuKeysByPath,
  getDefaultOpenKeys,
  getRouteFromKey,
  type MenuItemConfig,
  menuConfig,
} from "./constants";

export default function DashboardLayout({
  user,
  lang,
  langMode,
  theme,
  themeMode,
  onUpdateUser,
  onLogout,
  onChangeLangMode,
  onChangeThemeMode,
}: DashboardLayoutProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [systemSettingsOpen, setSystemSettingsOpen] = useState(false);
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const updateProfileMutation = trpc.user.updateProfile.useMutation();

  // 处理主题切换，同时保存到后端
  const handleThemeModeChange = (mode: ThemeMode) => {
    onChangeThemeMode(mode);
    // 如果用户已登录，同步到后端
    if (user) {
      updateProfileMutation.mutate(
        { settings: { themeMode: mode } },
        {
          onSuccess: (updatedUser) => {
            onUpdateUser(updatedUser);
          },
        },
      );
    }
  };

  // 处理语言切换，同时保存到后端
  const handleLangModeChange = (mode: LangMode) => {
    onChangeLangMode(mode);
    // 如果用户已登录，同步到后端
    if (user) {
      updateProfileMutation.mutate(
        { settings: { langMode: mode } },
        {
          onSuccess: (updatedUser) => {
            onUpdateUser(updatedUser);
          },
        },
      );
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const _langLabel = langMode === "auto" ? t("common.auto") : LANG_NAMES[lang];
  const _themeLabel =
    themeMode === "auto" ? t("common.auto") : t(`common.theme.${theme}`);

  const langItems = Object.entries(LANG_NAMES).map(([key, label]) => ({
    key,
    label,
  }));
  langItems.unshift({ key: "auto", label: t("common.auto") });

  const themeItems = [
    { key: "auto", label: t("common.auto") },
    { key: "light", label: t("common.theme.light") },
    { key: "dark", label: t("common.theme.dark") },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const { workspace } = useParams<{ workspace: string }>();
  const prevWorkspaceRef = useRef(workspace);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 获取工作空间列表
  const workspacesQuery = trpc.workspace.list.useQuery();
  const workspaces = workspacesQuery.data ?? [];
  const workspaceExists = workspaces.some((ws) => ws.slug === workspace);
  const utils = trpc.useUtils();

  // 检测 workspace 参数变化，设置过渡状态
  useEffect(() => {
    if (
      prevWorkspaceRef.current !== workspace &&
      prevWorkspaceRef.current !== undefined
    ) {
      setIsTransitioning(true);

      // 给缓存更新一个时间窗口，等待列表查询完成
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // 增加到 500ms 确保缓存更新完成

      return () => clearTimeout(timer);
    }
    prevWorkspaceRef.current = workspace;
  }, [workspace]);

  // 将 menuConfig 转换为 Ant Design Menu 的 items 格式
  const buildMenuItems = (items: MenuItemConfig[]): MenuProps["items"] => {
    return items.map((item) => {
      // 获取翻译标签：使用 _ 作为父级标签，或直接使用 labelKey
      const getLabel = (labelKey: string): string => {
        // 检查是否有嵌套的 _ 翻译
        const nestedKey = `dashboard.menu.${labelKey}._`;
        const directKey = `dashboard.menu.${labelKey}`;
        const nestedLabel = t(nestedKey);
        // 如果 nested key 存在（不返回 key 本身），使用它
        if (nestedLabel !== nestedKey) {
          return nestedLabel;
        }
        return t(directKey);
      };

      const label = getLabel(item.labelKey);

      if (item.children && item.children.length > 0) {
        return {
          key: item.key,
          label,
          children: buildMenuItems(item.children),
        };
      }

      return {
        key: item.key,
        label,
      };
    });
  };

  const menuItemConfigs = buildMenuItems(menuConfig);

  // 根据当前路径计算激活的菜单 keys
  const basePath = `/dashboard/${workspace}`;
  const selectedKeys = findMenuKeysByPath(location.pathname, basePath);
  const [openKeys, setOpenKeys] = useState<string[]>(() =>
    getDefaultOpenKeys(selectedKeys),
  );

  // 当选中项变化时，自动展开父级菜单
  useEffect(() => {
    const defaultOpenKeys = getDefaultOpenKeys(selectedKeys);
    setOpenKeys((prev) => {
      const newKeys = new Set([...prev, ...defaultOpenKeys]);
      return Array.from(newKeys);
    });
  }, [selectedKeys]);

  const handleWorkspaceChange = async (newWorkspace: string) => {
    // 跳转到新空间站的首页（工作台）
    navigate(`/dashboard/${newWorkspace}`);

    // 刷新所有相关数据
    await Promise.all([
      utils.workspace.list.invalidate(),
      utils.workspace.getBySlug.invalidate({ slug: newWorkspace }),
      // 如果有其他需要刷新的查询，在这里添加
    ]);
  };

  const handleMenuClick = (key: string) => {
    const routeSuffix = getRouteFromKey(key);
    if (routeSuffix !== null) {
      navigate(`/dashboard/${workspace}${routeSuffix}`);
      setMobileMenuOpen(false);
    }
    // 如果 routeSuffix 为 null，说明是父级菜单，不执行跳转
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
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

  // 在过渡期间，跳过 workspace 存在性检查，直接渲染内容
  // 这样可以避免闪烁，让页面内容平滑过渡
  if (workspacesQuery.isFetched && !workspaceExists && !isTransitioning) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <WorkspaceNotFoundPage
          workspace={workspace}
          fallbackWorkspace={workspaces[0]?.slug}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden h-full w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
          {/* Workspace Switcher at Top */}
          <WorkspaceSwitcher
            workspaces={workspaces}
            currentWorkspace={workspace}
            onSwitch={handleWorkspaceChange}
            onOpenCreate={() => setCreateWorkspaceOpen(true)}
          />

          <nav className="flex-1 space-y-1 overflow-y-auto pt-2 text-sm">
            <Menu
              mode="inline"
              items={menuItemConfigs}
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onOpenChange={handleOpenChange}
              onClick={({ key }) => handleMenuClick(key)}
              className="border-none bg-transparent"
              theme={theme === "dark" ? "dark" : "light"}
              style={{ borderInlineEnd: "none" }}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 lg:justify-end lg:px-6 lg:py-4 dark:border-slate-800 dark:bg-slate-900">
            {/* Mobile menu button */}
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
                  onClick: ({ key }) => handleLangModeChange(key as LangMode),
                }}
              >
                <Button
                  size="middle"
                  shape="circle"
                  type="text"
                  icon={<GlobalOutlined />}
                />
              </Dropdown>
              <Dropdown
                trigger={["hover"]}
                menu={{
                  items: themeItems,
                  onClick: ({ key }) => handleThemeModeChange(key as ThemeMode),
                }}
              >
                <Button
                  size="middle"
                  shape="circle"
                  type="text"
                  icon={<BulbOutlined />}
                />
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

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        open={createWorkspaceOpen}
        onClose={() => setCreateWorkspaceOpen(false)}
        onSuccess={(newWorkspace) => {
          // Navigate to the newly created workspace
          navigate(`/dashboard/${newWorkspace.slug}`);
          setMobileMenuOpen(false);
        }}
      />

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
          {/* Close button */}
          <div className="flex justify-end p-2">
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>

          {/* Workspace Switcher */}
          <WorkspaceSwitcher
            workspaces={workspaces}
            currentWorkspace={workspace}
            onSwitch={(slug) => {
              handleWorkspaceChange(slug);
              setMobileMenuOpen(false);
            }}
            onOpenCreate={() => {
              setCreateWorkspaceOpen(true);
              setMobileMenuOpen(false);
            }}
          />

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto pt-2 text-sm">
            <Menu
              mode="inline"
              items={menuItemConfigs}
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onOpenChange={handleOpenChange}
              onClick={({ key }) => handleMenuClick(key)}
              className="border-none bg-transparent"
              theme={theme === "dark" ? "dark" : "light"}
              style={{ borderInlineEnd: "none" }}
            />
          </nav>
        </div>
      </Drawer>
    </div>
  );
}
