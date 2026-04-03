import type { AuthSchema } from "./zh.js";

export const authEn: AuthSchema = {
  errors: {
    invalidCredentials: "Invalid email or password",
    defaultWorkspaceNotFound: "Default workspace not found",
    emailAlreadyRegistered: "Email already registered",
    tooManyRequests: "Too many requests, please try again later",
    wechatLoginFailed: "WeChat login failed",
    wechatPhoneFailed: "Failed to get phone number",
  },
  ui: {
    login: "Login",
    register: "Register",
    password: "Password",
    noAccountRegister: "No account? Register",
    haveAccountLogin: "Have an account? Sign in",
  },
};
