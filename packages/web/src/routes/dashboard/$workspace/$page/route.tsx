import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { PAGE_NAMES } from "@/components/dashboard/nav-config";
import WorkspaceSettingsPage from "@/components/workspace/WorkspaceSettingsPage";

export default function DemoPageRoute() {
  const { t } = useTranslation();
  const { page } = useParams<{ page: string }>();

  if (page === "settings") {
    return <WorkspaceSettingsPage />;
  }

  const pageName =
    (page && PAGE_NAMES[page]) ?? page ?? t("dashboard.unknownPage");

  return (
    <div className="flex h-full items-center justify-center p-8">
      <p className="text-2xl font-medium text-[var(--text-muted)]">
        {t("dashboard.switchedTo")}&nbsp;
        <span className="text-[var(--text-primary)] font-semibold">
          {pageName}
        </span>
      </p>
    </div>
  );
}
