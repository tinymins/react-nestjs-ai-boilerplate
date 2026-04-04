import { Avatar, Button, Input, Modal, Select } from "@acme/components";
import type { User } from "@acme/types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { userApi } from "@/generated/rust-api";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { message } from "@/lib/message";

interface ProfileSettingsModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (user: User) => void;
}

type TabKey = "profile" | "password";

function ProfileTab({
  user,
  onClose,
  onUpdateUser,
}: {
  user: User;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [langMode, setLangMode] = useState<
    "auto" | "zh-CN" | "en-US" | "de-DE" | "ja-JP" | "zh-TW"
  >(user.settings?.langMode ?? "auto");
  const [themeMode, setThemeMode] = useState<"auto" | "light" | "dark">(
    user.settings?.themeMode ?? "auto",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatar = useAvatarUpload(user, onUpdateUser);

  // biome-ignore lint/correctness/useExhaustiveDependencies: syncFromUser is stable (useCallback)
  useEffect(() => {
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setLangMode(user.settings?.langMode ?? "auto");
    setThemeMode(user.settings?.themeMode ?? "auto");
    avatar.syncFromUser(user);
  }, [user]);

  const updateMutation = userApi.updateProfile.useMutation({
    onSuccess: (updated) => {
      onUpdateUser(updated);
      message.success(t("userMenu.saveSuccess"));
      onClose();
    },
    onError: (err) => {
      message.error(err.message || t("userMenu.saveFailed"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      settings: { langMode, themeMode },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Avatar upload */}
      <div className="flex items-center gap-4">
        <Avatar
          src={avatar.avatarUrl || undefined}
          alt={name || user.name}
          size="large"
        >
          {(name || user.name || "?").charAt(0).toUpperCase()}
        </Avatar>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={avatar.handleFileChange}
          />
          <Button
            type="button"
            variant="default"
            loading={avatar.uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {t("common.uploadPhoto")}
          </Button>
          {avatar.avatarKey && (
            <Button
              type="button"
              variant="text"
              loading={avatar.deleteMutation.isPending}
              onClick={() => avatar.deleteMutation.mutate()}
            >
              {t("common.removePhoto")}
            </Button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
          {t("userMenu.name")}
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
          {t("userMenu.email")}
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
          {t("common.language")}
        </label>
        <Select
          value={langMode}
          onChange={(val) =>
            setLangMode(
              val as "auto" | "zh-CN" | "en-US" | "de-DE" | "ja-JP" | "zh-TW",
            )
          }
          options={[
            { value: "auto", label: t("common.followSystem") },
            { value: "zh-CN", label: t("common.lang.zhCN") },
            { value: "en-US", label: t("common.lang.enUS") },
            { value: "de-DE", label: t("common.lang.deDE") },
            { value: "ja-JP", label: t("common.lang.jaJP") },
            { value: "zh-TW", label: t("common.lang.zhTW") },
          ]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
          {t("common.theme")}
        </label>
        <Select
          value={themeMode}
          onChange={(val) => setThemeMode(val as "auto" | "light" | "dark")}
          options={[
            { value: "auto", label: t("common.followSystem") },
            { value: "light", label: t("common.light") },
            { value: "dark", label: t("common.dark") },
          ]}
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="text" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={updateMutation.isPending}
        >
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
}

function PasswordTab({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const changePasswordMutation = userApi.changePassword.useMutation({
    onSuccess: () => {
      message.success(t("userMenu.passwordChanged"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setValidationError("");
    },
    onError: (err) => {
      message.error(err.message || t("userMenu.saveFailed"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (newPassword !== confirmPassword) {
      setValidationError(t("userMenu.passwordMismatch"));
      return;
    }
    await changePasswordMutation.mutateAsync({
      currentPassword,
      newPassword,
    });
  };

  const displayError = validationError || changePasswordMutation.error?.message;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
          {t("userMenu.currentPassword")}
        </label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
          {t("userMenu.newPassword")}
        </label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
          {t("userMenu.confirmPassword")}
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>

      {displayError && (
        <p
          className="rounded-md border px-3 py-2 text-sm
            text-[var(--accent-text)] bg-[var(--accent-subtle)]
            border-[var(--accent-text)]"
        >
          {displayError}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="text" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={changePasswordMutation.isPending}
        >
          {t("userMenu.changePassword")}
        </Button>
      </div>
    </form>
  );
}

export default function ProfileSettingsModal({
  open,
  onClose,
  user,
  onUpdateUser,
}: ProfileSettingsModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  useEffect(() => {
    if (open) setActiveTab("profile");
  }, [open]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "profile", label: t("userMenu.profileTab") },
    { key: "password", label: t("userMenu.passwordTab") },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t("userMenu.profileSettings")}
      footer={null}
    >
      <div className="flex gap-4 border-b border-[var(--border-default)] mb-4">
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

      {activeTab === "profile" && (
        <ProfileTab user={user} onClose={onClose} onUpdateUser={onUpdateUser} />
      )}
      {activeTab === "password" && <PasswordTab onClose={onClose} />}
    </Modal>
  );
}
