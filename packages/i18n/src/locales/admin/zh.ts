export const adminZh = {
  errors: {
    cannotModifySelf: "不能修改自己的角色",
    cannotDeleteSelf: "不能删除自己的账户",
    cannotResetOwnPassword: "请使用个人设置修改密码",
    userNotFound: "用户不存在",
    invalidInvitationCode: "邀请码无效",
    invitationCodeExpired: "邀请码已过期",
  },
  ui: {
    systemSettings: "系统设置",
    userManagement: "用户管理",
    invitationCodes: "邀请码",
    allowRegistration: "允许注册",
    singleWorkspaceMode: "单工作空间模式",
    addUser: "添加用户",
    generateInvitation: "生成邀请码",
    expiresInHours: "过期时间（小时）",
    role: "角色",
    actions: "操作",
    resetPassword: "重置密码",
    deleteUser: "删除用户",
    copyLink: "复制链接",
    status: "状态",
    used: "已使用",
    expired: "已过期",
    unused: "未使用",
    general: "通用",
    users: "用户",
    invitations: "邀请",
  },
};

export type AdminSchema = typeof adminZh;
