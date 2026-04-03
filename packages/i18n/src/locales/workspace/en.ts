import type { WorkspaceSchema } from "./zh.js";

export const workspaceEn: WorkspaceSchema = {
  errors: {
    notFound: "Workspace not found",
    notFoundDesc: "does not exist or you don't have access to it.",
    onlyOwnerCanUpdate: "Only the owner can update",
    onlyOwnerCanDelete: "Only the owner can delete",
    slugExists: "Slug already exists",
  },
  ui: {
    workspaces: "Workspaces",
    select: "Select workspace",
    new: "New workspace",
    createSuccess: "Workspace created successfully",
    createFailed: "Failed to create",
    name: "Name",
    namePlaceholder: "My workspace",
    description: "Description (optional)",
    create: "Create",
    slugLabel: "Slug",
    slugPlaceholder: "my-workspace",
    placeholder: "Workspace Placeholder",
    currentWorkspace: "Current workspace:",
    userLabel: "User:",
    defaultNameSuffix: "'s workspace",
    defaultDesc: "Default workspace",
    loadError: "Failed to load workspaces",
    retryLater: "Please try again later",
    empty: "No workspaces yet",
    createFirst: "Please create a workspace first",
  },
};
