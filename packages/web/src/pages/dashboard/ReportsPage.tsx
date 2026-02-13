import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function ReportsPage() {
  const { workspace } = useParams<{ workspace: string }>();
  const { t } = useTranslation();
  const menuItems = t("dashboard.menu", { returnObjects: true }) as string[];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold">{menuItems[6]}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">
          {t("dashboard.reports.description")}
        </p>
        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
          {t("dashboard.reports.workspaceLabel")}: {workspace}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            labelKey: "dashboard.reports.testCoverage",
            value: "92%",
            trend: "+5%",
          },
          {
            labelKey: "dashboard.reports.defectDensity",
            value: "0.8",
            trend: "-12%",
          },
          {
            labelKey: "dashboard.reports.automationRate",
            value: "78%",
            trend: "+8%",
          },
        ].map((stat) => (
          <div key={stat.labelKey} className="card">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(stat.labelKey)}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-semibold">{stat.value}</p>
              <span className="text-sm text-green-600 dark:text-green-400">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
