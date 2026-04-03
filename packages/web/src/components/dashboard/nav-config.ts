import {
  BarChart3,
  Bell,
  BookOpen,
  FileText,
  FolderOpen,
  Gift,
  Home,
  Image,
  Key,
  type LucideIcon,
  Megaphone,
  MousePointerClick,
  Palette,
  ScrollText,
  Settings,
  Shield,
  Tag,
  Users,
  Zap,
} from "lucide-react";

type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "首页", path: "overview", icon: Home },
      { label: "数据总览", path: "analytics", icon: BarChart3 },
    ],
  },
  {
    title: "内容管理",
    items: [
      { label: "文章管理", path: "articles", icon: FileText },
      { label: "分类管理", path: "categories", icon: FolderOpen },
      { label: "标签管理", path: "tags", icon: Tag },
      { label: "媒体库", path: "media", icon: Image },
    ],
  },
  {
    title: "用户管理",
    items: [
      { label: "成员列表", path: "members", icon: Users },
      { label: "角色权限", path: "roles", icon: Shield },
      { label: "邀请记录", path: "invites", icon: BookOpen },
    ],
  },
  {
    title: "运营工具",
    items: [
      { label: "公告管理", path: "announcements", icon: Megaphone },
      { label: "活动管理", path: "campaigns", icon: Zap },
      { label: "优惠券", path: "coupons", icon: Gift },
    ],
  },
  {
    title: "数据分析",
    items: [
      { label: "访问统计", path: "stats", icon: MousePointerClick },
      { label: "用户行为", path: "behaviors", icon: ScrollText },
      { label: "转化报表", path: "reports", icon: BarChart3 },
    ],
  },
  {
    title: "系统设置",
    items: [
      { label: "通用设置", path: "settings", icon: Settings },
      { label: "外观主题", path: "appearance", icon: Palette },
      { label: "通知设置", path: "notifications", icon: Bell },
      { label: "API 密钥", path: "api-keys", icon: Key },
      { label: "审计日志", path: "audit", icon: ScrollText },
    ],
  },
];

/** path → 中文名，由 NAV_SECTIONS 派生，无需手动维护 */
export const PAGE_NAMES: Record<string, string> = Object.fromEntries(
  NAV_SECTIONS.flatMap((s) => s.items.map((item) => [item.path, item.label])),
);
