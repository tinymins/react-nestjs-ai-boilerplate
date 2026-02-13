import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function DefectsPage() {
  const { workspace } = useParams<{ workspace: string }>();
  const { t } = useTranslation();
  const menuItems = t("dashboard.menu", { returnObjects: true }) as string[];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold">{menuItems[5]}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">
          {t("dashboard.defects.description")}
        </p>
        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
          {t("common.workspaceLabel")}: {workspace}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            labelKey: "common.severity.critical",
            value: "2",
            color: "bg-red-100 text-red-700 dark:bg-red-900/30",
          },
          {
            labelKey: "common.severity.high",
            value: "5",
            color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30",
          },
          {
            labelKey: "common.severity.medium",
            value: "12",
            color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30",
          },
          {
            labelKey: "common.severity.low",
            value: "8",
            color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
          },
        ].map((stat) => (
          <div key={stat.labelKey} className={`card ${stat.color}`}>
            <p className="text-sm font-medium">{t(stat.labelKey)}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
