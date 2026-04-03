import {
  AdminUserSchema,
  CreateUserInputSchema,
  ForceResetPasswordInputSchema,
  InvitationCodeSchema,
  SystemSettingsSchema,
  UpdateUserRoleInputSchema,
} from "@acme/types";
import { z } from "zod";
import { router } from "@/trpc/init";
import { adminProcedure, superAdminProcedure } from "@/trpc/middlewares";
import { adminService } from "./admin.service";

const SystemSettingsOutputSchema = SystemSettingsSchema.extend({
  singleWorkspaceModeOverridden: z.boolean().optional(),
});

export const adminRouter = router({
  // =========== Admin + Superadmin ===========

  getSystemSettings: adminProcedure
    .output(SystemSettingsOutputSchema)
    .query(async () => {
      const settings = await adminService.getSystemSettings();
      const override = process.env.SINGLE_WORKSPACE_MODE_OVERRIDE;
      const isOverridden = override === "true" || override === "false";
      return {
        allowRegistration: settings.allowRegistration,
        singleWorkspaceMode: isOverridden
          ? override === "true"
          : settings.singleWorkspaceMode,
        singleWorkspaceModeOverridden: isOverridden,
      };
    }),

  updateSystemSettings: adminProcedure
    .input(
      z.object({
        allowRegistration: z.boolean().optional(),
        singleWorkspaceMode: z.boolean().optional(),
      }),
    )
    .output(SystemSettingsOutputSchema)
    .mutation(async ({ input }) => {
      const override = process.env.SINGLE_WORKSPACE_MODE_OVERRIDE;
      const isOverridden = override === "true" || override === "false";
      const { singleWorkspaceMode, ...rest } = input;
      const updateInput = isOverridden ? rest : input;
      const updated = await adminService.updateSystemSettings(updateInput);
      return {
        allowRegistration: updated.allowRegistration,
        singleWorkspaceMode: isOverridden
          ? override === "true"
          : updated.singleWorkspaceMode,
        singleWorkspaceModeOverridden: isOverridden,
      };
    }),

  // =========== Superadmin Only ===========

  listUsers: superAdminProcedure
    .output(z.array(AdminUserSchema))
    .query(async () => {
      return adminService.listUsers();
    }),

  updateUserRole: superAdminProcedure
    .input(UpdateUserRoleInputSchema)
    .output(AdminUserSchema)
    .mutation(async ({ input, ctx }) => {
      return adminService.updateUserRole(
        input.userId,
        input.role,
        ctx.userId,
        ctx.language,
      );
    }),

  forceResetPassword: superAdminProcedure
    .input(ForceResetPasswordInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      return adminService.forceResetPassword(
        input.userId,
        input.newPassword,
        ctx.userId,
        ctx.language,
      );
    }),

  deleteUser: superAdminProcedure
    .input(z.object({ userId: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      return adminService.deleteUser(input.userId, ctx.userId, ctx.language);
    }),

  createUser: superAdminProcedure
    .input(CreateUserInputSchema)
    .output(AdminUserSchema)
    .mutation(async ({ input, ctx }) => {
      return adminService.createUser(input, ctx.language);
    }),

  // =========== Invitation Codes ===========

  generateInvitationCode: superAdminProcedure
    .input(z.object({ expiresInHours: z.number().optional() }))
    .output(InvitationCodeSchema)
    .mutation(async ({ input, ctx }) => {
      return adminService.generateInvitationCode(
        ctx.userId,
        input.expiresInHours,
      );
    }),

  listInvitationCodes: superAdminProcedure
    .output(z.array(InvitationCodeSchema))
    .query(async () => {
      return adminService.listInvitationCodes();
    }),

  deleteInvitationCode: superAdminProcedure
    .input(z.object({ codeId: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return adminService.deleteInvitationCode(input.codeId);
    }),
});
