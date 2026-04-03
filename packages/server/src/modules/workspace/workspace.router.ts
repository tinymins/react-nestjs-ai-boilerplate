import {
  CreateWorkspaceInputSchema,
  UpdateWorkspaceInputSchema,
  WorkspaceSchema,
} from "@acme/types";
import { z } from "zod";
import { protectedProcedure, router } from "@/trpc/init";
import { workspaceProtectedProcedure } from "@/trpc/middlewares";
import { toWorkspaceOutput } from "./workspace.mapper";
import { workspaceService } from "./workspace.service";

export const workspaceRouter = router({
  list: protectedProcedure
    .input(z.void())
    .output(z.array(WorkspaceSchema))
    .query(async ({ ctx }) => {
      const workspaces = await workspaceService.listByUser(ctx.userId);
      return workspaces.map(toWorkspaceOutput);
    }),

  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .output(WorkspaceSchema.nullable())
    .query(async ({ input, ctx }) => {
      const workspace = await workspaceService.getBySlug(
        input.slug,
        ctx.userId,
      );
      return workspace ? toWorkspaceOutput(workspace) : null;
    }),

  create: protectedProcedure
    .input(CreateWorkspaceInputSchema)
    .output(WorkspaceSchema)
    .mutation(async ({ input, ctx }) => {
      const workspace = await workspaceService.create(input, ctx.userId);
      return toWorkspaceOutput(workspace);
    }),

  update: workspaceProtectedProcedure
    .input(UpdateWorkspaceInputSchema)
    .output(WorkspaceSchema)
    .mutation(async ({ input, ctx }) => {
      const updated = await workspaceService.update(
        ctx.workspace.id,
        input,
        ctx.userId,
        ctx.language,
      );
      return toWorkspaceOutput(updated);
    }),

  delete: workspaceProtectedProcedure
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx }) => {
      return workspaceService.delete(
        ctx.workspace.id,
        ctx.userId,
        ctx.language,
      );
    }),
});
