import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function RequirementsPage() {
  const { workspace } = useParams<{ workspace: string }>();
  const { t } = useTranslation();
  const menuItems = t("dashboard.menu", { returnObjects: true }) as string[];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold">{menuItems[1]}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">
          {t("dashboard.requirements.description")}
        </p>
        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
          {t("dashboard.requirements.workspaceLabel")}: {workspace}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { titleKey: "dashboard.requirements.toAnalyze", count: 12, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
          { titleKey: "dashboard.requirements.inDesign", count: 8, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
          { titleKey: "dashboard.requirements.completed", count: 45, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" }
        ].map((item) => (
          <div key={item.titleKey} className={`card ${item.color}`}>
            <p className="text-sm font-medium">{t(item.titleKey)}</p>
            <p className="mt-2 text-4xl font-bold">{item.count}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">{t("dashboard.requirements.recentRequirements")}</h3>
        <div className="space-y-3">
          {[
            { id: "REQ-1024", titleKey: "dashboard.requirements.sampleTitle1", statusKey: "dashboard.requirements.toAnalyze" },
            { id: "REQ-1023", titleKey: "dashboard.requirements.sampleTitle2", statusKey: "dashboard.requirements.inDesign" },
            { id: "REQ-1022", titleKey: "dashboard.requirements.sampleTitle3", statusKey: "dashboard.requirements.completed" }
          ].map((req) => (
            <div key={req.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">{t(req.titleKey)}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{req.id}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">{t(req.statusKey)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
