import { AppSidebar, type AppSidebarSection } from "@acme/components";
import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { NAV_SECTIONS } from "./nav-config";

export default function SidebarNav() {
  const { workspace } = useParams<{ workspace: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const activePath = location.pathname.split("/").slice(3).join("/");

  const sections: AppSidebarSection[] = useMemo(
    () =>
      NAV_SECTIONS.map((section, i) => ({
        key: section.title ?? `s${i}`,
        label: section.title,
        items: section.items.map((item) => ({
          key: item.path,
          icon: <item.icon className="h-4 w-4" />,
          label: item.label,
        })),
      })),
    [],
  );

  return (
    <AppSidebar
      sections={sections}
      activeKey={activePath}
      onSelect={(key) => navigate(`/dashboard/${workspace}/${key}`)}
      className="border-none bg-transparent"
      style={{ width: "100%" }}
    />
  );
}
