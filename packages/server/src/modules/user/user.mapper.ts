import type { UserSettings } from "@acme/types";
import type { User } from "@/generated/prisma/client/client";

export const toUserOutput = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  settings: (user.settings as UserSettings | null) ?? null,
});
