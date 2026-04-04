import { Button, Input, Modal } from "@acme/components";
import { SYSTEM_SHARED_SLUG } from "@acme/types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { workspaceApi } from "@/generated/rust-api";
import { useSystemSettings } from "@/hooks";
import { message } from "@/lib/message";

type TabKey = "general" | "danger";

export default function WorkspaceSettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { workspace: workspaceSlug } = useParams<{ workspace: string }>();
  const { singleWorkspaceMode } = useSystemSettings();
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const effectiveSlug = singleWorkspaceMode
    ? SYSTEM_SHARED_SLUG
    : (workspaceSlug ?? "");

  const workspaceQuery = workspaceApi.getBySlug.useQuery(
    { slug: effectiveSlug },
    { enabled: effectiveSlug.length > 0 },
  );
  const workspace = workspaceQuery.data;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setSlug(workspace.slug);
      setDescription(workspace.description ?? "");
    }
  }, [workspace]);

  const updateMutation = workspaceApi.update.useMutation({
    onSuccess: (updated) => {
      message.success(t("workspace.saveSuccess"));
      if (!singleWorkspaceMode && updated.slug !== workspaceSlug) {
        navigate(`/dashboard/${updated.slug}/settings`, { replace: true });
      }
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const deleteMutation = workspaceApi.delete.useMutation({
    onSuccess: () => {
      message.success(t("workspace.deleteSuccess"));
      setDeleteModalOpen(false);
      navigate("/dashboard", { replace: true });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  if (!workspace) {
    if (workspaceQuery.isLoading) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-[var(--text-muted)]">{t("login.loading")}</p>
        </div>
      );
    }
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-[var(--text-muted)]">{t("workspace.notFound")}</p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();
    if (!trimmedName) {
      message.error(t("workspace.nameRequired"));
      return;
    }
    if (!singleWorkspaceMode) {
      if (!trimmedSlug) {
        message.error(t("workspace.slugRequired"));
        return;
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
        message.error(t("workspace.slugPattern"));
        return;
      }
    }
    await updateMutation.mutateAsync({
      id: workspace.id,
      name: trimmedName,
      slug: singleWorkspaceMode ? undefined : trimmedSlug,
      description: description.trim() || null,
    });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ id: workspace.id });
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "general", label: t("workspace.generalTab") },
    ...(!singleWorkspaceMode
      ? [{ key: "danger" as TabKey, label: t("workspace.dangerTab") }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
        {t("workspace.settings")}
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        {t("workspace.settingsSubtitle", { name: workspace.name })}
      </p>

      {tabs.length > 1 && (
        <div className="flex gap-4 border-b border-[var(--border-default)] mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer pb-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? "border-[var(--accent-text)] text-[var(--text-primary)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {activeTab === "general" && (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t("workspace.name")}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("workspace.namePlaceholder")}
              required
            />
          </div>

          {!singleWorkspaceMode && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                {t("workspace.slugLabel")}
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={t("workspace.slugPlaceholder")}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t("workspace.description")}
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={updateMutation.isPending}
            >
              {t("workspace.saveChanges")}
            </Button>
          </div>
        </form>
      )}

      {activeTab === "danger" && !singleWorkspaceMode && (
        <div className="rounded-md border border-red-300 dark:border-red-800 p-4">
          <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2">
            {t("workspace.deleteWorkspace")}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {t("workspace.deleteWorkspaceDesc")}
          </p>
          <Button
            type="button"
            variant="danger"
            onClick={() => setDeleteModalOpen(true)}
          >
            {t("workspace.deleteWorkspace")}
          </Button>
        </div>
      )}

      <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        title={t("workspace.confirmDeleteTitle")}
        footer={null}
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-primary)]">
            {t("workspace.confirmDeleteContent", { name: workspace.name })}
          </p>
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {t("workspace.confirmDeleteWarning")}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="text"
              onClick={() => setDeleteModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {t("common.delete")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
