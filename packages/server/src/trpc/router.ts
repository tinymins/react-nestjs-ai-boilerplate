import {
  adminRouter,
  authRouter,
  userRouter,
  wechatRouter,
  workspaceRouter,
} from "@/modules/index";
import { router } from "./init";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  workspace: workspaceRouter,
  wechat: wechatRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
