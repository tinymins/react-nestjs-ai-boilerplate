export const authZh = {
  errors: {
    invalidCredentials: "账号或密码错误",
    defaultWorkspaceNotFound: "未找到默认工作空间",
    emailAlreadyRegistered: "邮箱已注册",
    tooManyRequests: "请求过于频繁，请稍后再试",
    wechatLoginFailed: "微信登录失败",
    wechatPhoneFailed: "获取手机号失败",
  },
  ui: {
    login: "登录",
    register: "注册",
    password: "密码",
    noAccountRegister: "没有账号？去注册",
    haveAccountLogin: "已有账号？去登录",
  },
};

export type AuthSchema = typeof authZh;
