import { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Form, Input, Modal, Select, Tabs, Upload } from "antd";
import type { UploadProps } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useMessage } from "../../hooks";
import type { User } from "@acme/types";
import type { Lang, LangMode, ThemeMode } from "../../lib/types";
import { trpc } from "../../lib/trpc";
import { getAvatarColor, getAvatarInitial } from "../../lib/avatar";

type UserSettingsModalProps = {
  open: boolean;
  onClose: () => void;
  user: User;
  lang: Lang;
  langMode: LangMode;
  themeMode: ThemeMode;
  onUpdateUser: (user: User) => void;
  onChangeLangMode: (mode: LangMode) => void;
  onChangeThemeMode: (mode: ThemeMode) => void;
};

export default function UserSettingsModal({
  open,
  onClose,
  user,
  lang,
  langMode,
  themeMode,
  onUpdateUser,
  onChangeLangMode,
  onChangeThemeMode
}: UserSettingsModalProps) {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const message = useMessage();
  const profileQuery = trpc.user.getProfile.useQuery(undefined, { enabled: open });
  const updateMutation = trpc.user.updateProfile.useMutation();
  const deleteAvatarMutation = trpc.user.deleteAvatar.useMutation();
  const changePasswordMutation = trpc.user.changePassword.useMutation();
  const [avatarValue, setAvatarValue] = useState<string | null>(user.settings?.avatarUrl ?? null);
  const [activeTab, setActiveTab] = useState("profile");

  const profile = profileQuery.data ?? user;
  const displayName = profile.name || profile.email;
  const avatarColor = getAvatarColor(displayName);
  const avatarInitial = getAvatarInitial(profile.name, profile.email);

  const initialLangMode = profile.settings?.langMode ?? langMode;
  const initialThemeMode = profile.settings?.themeMode ?? themeMode;

  useEffect(() => {
    if (!open) {
      setActiveTab("profile");
      passwordForm.resetFields();
      return;
    }
    setAvatarValue(profile.settings?.avatarUrl ?? null);
    form.setFieldsValue({
      name: profile.name,
      email: profile.email,
      langMode: initialLangMode,
      themeMode: initialThemeMode
    });
  }, [open, profile.settings?.avatarUrl, profile.email, profile.name, initialLangMode, initialThemeMode, form, passwordForm]);

  const uploadProps: UploadProps = useMemo(
    () => ({
      showUploadList: false,
      beforeUpload: (file) => {
        if (!file.type.startsWith("image/")) {
          message.error(lang === "zh" ? "请上传图片文件" : "Please upload an image file");
          return Upload.LIST_IGNORE;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setAvatarValue(reader.result as string);
        };
        reader.readAsDataURL(file);
        return false;
      }
    }),
    [lang]
  );

  const handleSave = async () => {
    const values = await form.validateFields();
    const payload = {
      name: values.name?.trim(),
      email: values.email?.trim(),
      settings: {
        avatarUrl: avatarValue,
        langMode: values.langMode as LangMode,
        themeMode: values.themeMode as ThemeMode
      }
    };

    const updated = await updateMutation.mutateAsync(payload);
    onUpdateUser(updated as User);

    if (payload.settings?.langMode) {
      onChangeLangMode(payload.settings.langMode);
    }
    if (payload.settings?.themeMode) {
      onChangeThemeMode(payload.settings.themeMode);
    }

    message.success(lang === "zh" ? "设置已保存" : "Settings saved");
    onClose();
  };

  const handleRemoveAvatar = async () => {
    setAvatarValue(null);
    const updated = await deleteAvatarMutation.mutateAsync();
    onUpdateUser(updated as User);
    message.success(lang === "zh" ? "头像已移除" : "Avatar removed");
  };

  const handleChangePassword = async () => {
    const values = await passwordForm.validateFields();
    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      passwordForm.resetFields();
      message.success(lang === "zh" ? "密码已修改" : "Password changed successfully");
    } catch (error) {
      // 错误由 tRPC 错误处理器处理
    }
  };

  const profileTab = (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Avatar
          size={64}
          src={avatarValue ?? undefined}
          style={{ backgroundColor: avatarValue ? undefined : avatarColor }}
        >
          {avatarInitial}
        </Avatar>
        <div className="flex flex-col gap-2">
          <Upload {...uploadProps}>
            <Button size="small">{lang === "zh" ? "上传头像" : "Upload avatar"}</Button>
          </Upload>
          <Button size="small" danger disabled={!avatarValue} onClick={handleRemoveAvatar}>
            {lang === "zh" ? "移除头像" : "Remove avatar"}
          </Button>
        </div>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          label={lang === "zh" ? "用户名" : "User name"}
          name="name"
          rules={[{ required: true, message: lang === "zh" ? "请输入用户名" : "Please enter a user name" }]}
        >
          <Input placeholder={lang === "zh" ? "例如：陈伟" : "e.g. Chen Wei"} />
        </Form.Item>

        <Form.Item
          label={lang === "zh" ? "邮箱" : "Email"}
          name="email"
          rules={[{ required: true, message: lang === "zh" ? "请输入邮箱" : "Please enter your email" }]}
        >
          <Input type="email" placeholder="name@example.com" />
        </Form.Item>

        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item label={lang === "zh" ? "语言" : "Language"} name="langMode">
            <Select
              options={[
                { value: "auto", label: lang === "zh" ? "自动" : "Auto" },
                { value: "zh", label: "中文" },
                { value: "en", label: "English" }
              ]}
            />
          </Form.Item>

          <Form.Item label={lang === "zh" ? "主题" : "Theme"} name="themeMode">
            <Select
              options={[
                { value: "auto", label: lang === "zh" ? "自动" : "Auto" },
                { value: "light", label: lang === "zh" ? "亮色" : "Light" },
                { value: "dark", label: lang === "zh" ? "暗黑" : "Dark" }
              ]}
            />
          </Form.Item>
        </div>
      </Form>

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onClose}>{lang === "zh" ? "取消" : "Cancel"}</Button>
        <Button type="primary" loading={updateMutation.isPending} onClick={handleSave}>
          {lang === "zh" ? "保存" : "Save"}
        </Button>
      </div>
    </>
  );

  const passwordTab = (
    <>
      <Form form={passwordForm} layout="vertical">
        <Form.Item
          label={lang === "zh" ? "当前密码" : "Current Password"}
          name="oldPassword"
          rules={[{ required: true, message: lang === "zh" ? "请输入当前密码" : "Please enter current password" }]}
        >
          <Input.Password placeholder={lang === "zh" ? "请输入当前密码" : "Enter current password"} />
        </Form.Item>

        <Form.Item
          label={lang === "zh" ? "新密码" : "New Password"}
          name="newPassword"
          rules={[
            { required: true, message: lang === "zh" ? "请输入新密码" : "Please enter new password" },
            { min: 6, message: lang === "zh" ? "密码至少6位" : "Password must be at least 6 characters" }
          ]}
        >
          <Input.Password placeholder={lang === "zh" ? "请输入新密码（至少6位）" : "Enter new password (min 6 chars)"} />
        </Form.Item>

        <Form.Item
          label={lang === "zh" ? "确认新密码" : "Confirm New Password"}
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: lang === "zh" ? "请确认新密码" : "Please confirm new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(lang === "zh" ? "两次密码不一致" : "Passwords do not match"));
              }
            })
          ]}
        >
          <Input.Password placeholder={lang === "zh" ? "再次输入新密码" : "Confirm new password"} />
        </Form.Item>
      </Form>

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onClose}>{lang === "zh" ? "取消" : "Cancel"}</Button>
        <Button
          type="primary"
          loading={changePasswordMutation.isPending}
          onClick={handleChangePassword}
        >
          {lang === "zh" ? "修改密码" : "Change Password"}
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      open={open}
      title={lang === "zh" ? "账户设置" : "Account Settings"}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={480}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "profile",
            label: (
              <span>
                <UserOutlined className="mr-1" />
                {lang === "zh" ? "基本信息" : "Profile"}
              </span>
            ),
            children: profileTab
          },
          {
            key: "password",
            label: (
              <span>
                <LockOutlined className="mr-1" />
                {lang === "zh" ? "修改密码" : "Password"}
              </span>
            ),
            children: passwordTab
          }
        ]}
      />
    </Modal>
  );
}
