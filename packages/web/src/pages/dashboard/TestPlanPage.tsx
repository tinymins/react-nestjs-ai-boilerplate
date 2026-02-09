import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function TestPlanPage() {
  const { workspace } = useParams<{ workspace: string }>();
  const { t } = useTranslation();
  const menuItems = t("dashboard.menu", { returnObjects: true }) as string[];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold">{menuItems[2]}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">
          {t("dashboard.testPlan.description")}
        </p>
        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
          {t("dashboard.testPlan.workspaceLabel")}: {workspace}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { labelKey: "dashboard.testPlan.inProgress", value: "5" },
          { labelKey: "dashboard.testPlan.completedThisWeek", value: "12" },
          { labelKey: "dashboard.testPlan.avgCoverage", value: "87%" }
        ].map((stat) => (
          <div key={stat.labelKey} className="card">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t(stat.labelKey)}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
