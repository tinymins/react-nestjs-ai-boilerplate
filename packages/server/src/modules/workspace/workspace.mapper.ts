import type { Workspace } from "@/generated/prisma/client/client";

export const toWorkspaceOutput = (dbWorkspace: Workspace) => ({
  id: dbWorkspace.id,
  slug: dbWorkspace.slug,
  name: dbWorkspace.name,
  description: dbWorkspace.description,
  createdAt: dbWorkspace.createdAt.toISOString(),
});
