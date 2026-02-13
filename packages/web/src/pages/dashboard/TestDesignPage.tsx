import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function TestDesignPage() {
  const { workspace } = useParams<{ workspace: string }>();
  const { t } = useTranslation();
  const menuItems = t("dashboard.menu", { returnObjects: true }) as string[];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold">{menuItems[3]}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">
          {t("dashboard.testDesign.description")}
        </p>
        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
          {t("common.workspaceLabel")}: {workspace}
        </p>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {t("dashboard.testDesign.caseLibrary")}
          </h3>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            {t("dashboard.testDesign.newCase")}
          </button>
        </div>
        <p className="text-slate-500 dark:text-slate-300">
          {t("dashboard.testDesign.totalCases", { count: 186 })}
        </p>
      </div>
    </div>
  );
}
