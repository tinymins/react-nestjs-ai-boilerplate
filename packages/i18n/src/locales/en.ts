import { adminEn } from "./admin/en.js";
import { authEn } from "./auth/en.js";
import { commonEn } from "./common/en.js";
import { landingEn } from "./landing/en.js";
import { userEn } from "./user/en.js";
import { workspaceEn } from "./workspace/en.js";
import type { TranslationSchema } from "./zh.js";

export const en: TranslationSchema = {
  translation: {
    errors: {
      common: commonEn.errors,
      auth: authEn.errors,
      user: userEn.errors,
      workspace: workspaceEn.errors,
      admin: adminEn.errors,
    },
    auth: authEn.ui,
    common: commonEn.ui,
    landing: landingEn.ui,
    user: userEn.ui,
    workspace: workspaceEn.ui,
    admin: adminEn.ui,
  },
};
