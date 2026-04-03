import { randomBytes } from "node:crypto";
import { db } from "@/db/client";
import type { Language } from "@/i18n";
import { getMessage } from "@/i18n";
import { AppError } from "@/trpc/errors";
import { hashPassword } from "@/utils/password";

export class AdminService {
  async getStats() {
    const count = await db.user.count();
    return { userCount: count };
  }

  async getSystemSettings() {
    const settings = await db.systemSettings.findFirst();
    if (!settings) {
      return db.systemSettings.create({
        data: { allowRegistration: true, singleWorkspaceMode: false },
      });
    }
    return settings;
  }

  async updateSystemSettings(updates: {
    allowRegistration?: boolean;
    singleWorkspaceMode?: boolean;
  }) {
    const settings = await this.getSystemSettings();
    return db.systemSettings.update({
      where: { id: settings.id },
      data: updates,
    });
  }

  async listUsers() {
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      lastLoginAt: null,
      createdAt: u.createdAt.toISOString(),
    }));
  }

  async updateUserRole(
    userId: string,
    role: string,
    operatorId: string,
    language: Language,
  ) {
    if (userId === operatorId) {
      throw AppError.badRequest(language, "errors.admin.cannotChangeOwnRole");
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw AppError.notFound(language, "errors.admin.userNotFound");
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { role: role as "admin" | "user" },
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      lastLoginAt: null,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  async forceResetPassword(
    userId: string,
    newPassword: string,
    operatorId: string,
    language: Language,
  ) {
    if (userId === operatorId) {
      throw AppError.badRequest(language, "errors.admin.usePersonalSettings");
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw AppError.notFound(language, "errors.admin.userNotFound");
    }

    const passwordHash = await hashPassword(newPassword);
    await db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true };
  }

  async deleteUser(userId: string, operatorId: string, language: Language) {
    if (userId === operatorId) {
      throw AppError.badRequest(language, "errors.admin.cannotDeleteSelf");
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw AppError.notFound(language, "errors.admin.userNotFound");
    }

    if (user.role === "superadmin") {
      throw AppError.forbidden(language, "errors.admin.cannotDeleteSuperadmin");
    }

    await db.$transaction(async (tx) => {
      await tx.session.deleteMany({ where: { userId } });
      await tx.workspaceMember.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    return { success: true };
  }

  async createUser(
    input: { name: string; email: string; password: string; role?: string },
    language: Language,
  ) {
    const existing = await db.user.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      throw AppError.badRequest(
        language,
        "errors.admin.emailAlreadyRegistered",
      );
    }

    const role = (input.role ?? "user") as "admin" | "user";
    const passwordHash = await hashPassword(input.password);
    const workspaceName = `${input.name}${getMessage(
      language,
      "errors.admin.workspaceSuffix",
    )}`;

    const baseSlug =
      input.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || "workspace";
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existingWs = await db.workspace.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (!existingWs) break;
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const result = await db.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
          role,
        },
      });

      const createdWorkspace = await tx.workspace.create({
        data: {
          slug,
          name: workspaceName,
          description: getMessage(
            language,
            "errors.admin.defaultWorkspaceDesc",
          ),
        },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: createdWorkspace.id,
          userId: createdUser.id,
          role: "owner",
        },
      });

      return createdUser;
    });

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      lastLoginAt: null,
      createdAt: result.createdAt.toISOString(),
    };
  }

  // =========== Invitation Codes ===========

  async generateInvitationCode(createdBy: string, expiresInHours?: number) {
    const code = randomBytes(16).toString("hex");
    const expiresAt = expiresInHours
      ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
      : null;

    const created = await db.invitationCode.create({
      data: { code, createdBy, expiresAt },
    });

    return {
      id: created.id,
      code: created.code,
      createdBy: created.createdBy,
      usedBy: null,
      usedAt: null,
      expiresAt: created.expiresAt?.toISOString() ?? null,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async validateInvitationCode(code: string) {
    const invitation = await db.invitationCode.findFirst({
      where: { code, usedBy: null },
    });

    if (!invitation) {
      return { valid: false as const, reason: "invalid" as const };
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      return { valid: false as const, reason: "expired" as const };
    }

    return { valid: true as const, invitation };
  }

  async useInvitationCode(code: string, usedBy: string) {
    await db.invitationCode.updateMany({
      where: { code },
      data: { usedBy, usedAt: new Date() },
    });
  }

  async listInvitationCodes() {
    const codes = await db.invitationCode.findMany({
      orderBy: { createdAt: "desc" },
    });

    return codes.map((c) => ({
      id: c.id,
      code: c.code,
      createdBy: c.createdBy,
      usedBy: c.usedBy ?? null,
      usedAt: c.usedAt?.toISOString() ?? null,
      expiresAt: c.expiresAt?.toISOString() ?? null,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  async deleteInvitationCode(codeId: string) {
    await db.invitationCode.delete({ where: { id: codeId } });
    return { success: true };
  }
}

export const adminService = new AdminService();
