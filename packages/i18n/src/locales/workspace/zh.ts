export const workspaceZh = {
  errors: {
    notFound: "工作空间不存在",
    notFoundDesc: "不存在，或你没有访问权限。",
    onlyOwnerCanUpdate: "仅创建者可修改",
    onlyOwnerCanDelete: "仅创建者可删除",
    slugExists: "Slug 已存在",
  },
  ui: {
    workspaces: "空间站",
    select: "选择空间站",
    new: "新建空间站",
    createSuccess: "空间站创建成功",
    createFailed: "创建失败",
    name: "名称",
    namePlaceholder: "我的空间站",
    description: "描述（可选）",
    create: "创建",
    slugLabel: "Slug",
    slugPlaceholder: "my-workspace",
    placeholder: "空间站占位符",
    currentWorkspace: "当前工作空间：",
    userLabel: "用户：",
    defaultNameSuffix: "的空间站",
    defaultDesc: "默认工作空间",
    loadError: "无法加载工作空间",
    retryLater: "请稍后重试",
    empty: "暂无工作空间",
    createFirst: "请先创建工作空间",
  },
};

export type WorkspaceSchema = typeof workspaceZh;
