import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function AutomationPage() {
  const { workspace } = useParams<{ workspace: string }>();
  const { t } = useTranslation();
  const menuItems = t("dashboard.menu", { returnObjects: true }) as string[];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold">{menuItems[7]}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">
          {t("dashboard.automation.description")}
        </p>
        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
          {t("dashboard.automation.workspaceLabel")}: {workspace}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { labelKey: "dashboard.automation.totalScripts", value: "324" },
          { labelKey: "dashboard.automation.successRate", value: "94%" },
          { labelKey: "dashboard.automation.avgDuration", value: "12m" },
        ].map((stat) => (
          <div key={stat.labelKey} className="card">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(stat.labelKey)}
            </p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
