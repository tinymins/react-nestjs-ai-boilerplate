import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function ExecutionPage() {
  const { workspace } = useParams<{ workspace: string }>();
  const { t } = useTranslation();
  const menuItems = t("dashboard.menu", { returnObjects: true }) as string[];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold">{menuItems[4]}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">
          {t("dashboard.execution.description")}
        </p>
        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
          {t("dashboard.execution.workspaceLabel")}: {workspace}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            labelKey: "dashboard.execution.running",
            value: "18",
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            labelKey: "dashboard.execution.passed",
            value: "142",
            color: "text-green-600 dark:text-green-400",
          },
          {
            labelKey: "dashboard.execution.failed",
            value: "8",
            color: "text-red-600 dark:text-red-400",
          },
          {
            labelKey: "dashboard.execution.blocked",
            value: "3",
            color: "text-yellow-600 dark:text-yellow-400",
          },
        ].map((stat) => (
          <div key={stat.labelKey} className="card">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(stat.labelKey)}
            </p>
            <p className={`mt-2 text-3xl font-semibold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
