import { FileText, Home, type LucideIcon, Settings } from "lucide-react";

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
    items: [{ label: "首页", path: "overview", icon: Home }],
  },
  {
    title: "内容管理",
    items: [{ label: "文章管理", path: "articles", icon: FileText }],
  },
  {
    title: "系统设置",
    items: [{ label: "通用设置", path: "settings", icon: Settings }],
  },
];

/** path → 中文名，由 NAV_SECTIONS 派生，无需手动维护 */
export const PAGE_NAMES: Record<string, string> = Object.fromEntries(
  NAV_SECTIONS.flatMap((s) => s.items.map((item) => [item.path, item.label])),
);
