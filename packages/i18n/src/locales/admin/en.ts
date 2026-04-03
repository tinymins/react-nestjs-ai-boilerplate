import type { AdminSchema } from "./zh.js";

export const adminEn: AdminSchema = {
  errors: {
    cannotModifySelf: "Cannot modify your own role",
    cannotDeleteSelf: "Cannot delete your own account",
    cannotResetOwnPassword: "Please use profile settings to change password",
    userNotFound: "User not found",
    invalidInvitationCode: "Invalid invitation code",
    invitationCodeExpired: "Invitation code has expired",
  },
  ui: {
    systemSettings: "System Settings",
    userManagement: "User Management",
    invitationCodes: "Invitation Codes",
    allowRegistration: "Allow Registration",
    singleWorkspaceMode: "Single Workspace Mode",
    addUser: "Add User",
    generateInvitation: "Generate Invitation",
    expiresInHours: "Expires in (hours)",
    role: "Role",
    actions: "Actions",
    resetPassword: "Reset Password",
    deleteUser: "Delete User",
    copyLink: "Copy Link",
    status: "Status",
    used: "Used",
    expired: "Expired",
    unused: "Unused",
    general: "General",
    users: "Users",
    invitations: "Invitations",
  },
};
