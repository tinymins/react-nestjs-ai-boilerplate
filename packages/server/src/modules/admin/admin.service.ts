import { eq, sql, ne, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "../../db/client";
import { users, systemSettings } from "../../db/schema";
import type { UserRole } from "@acme/types";

export class AdminService {
	async getStats() {
		const result = await db.execute(sql`select count(*)::int as count from users`);
		const count = Number(result.rows?.[0]?.count ?? 0);
		return { userCount: count };
	}

	/** 获取系统设置 */
	async getSystemSettings() {
		const [settings] = await db.select().from(systemSettings).limit(1);
		if (!settings) {
			const [created] = await db
				.insert(systemSettings)
				.values({ allowRegistration: true })
				.returning();
			return created;
		}
		return settings;
	}

	/** 更新系统设置 */
	async updateSystemSettings(updates: { allowRegistration?: boolean }) {
		const settings = await this.getSystemSettings();
		const [updated] = await db
			.update(systemSettings)
			.set({
				...updates,
				updatedAt: new Date()
			})
			.where(eq(systemSettings.id, settings.id))
			.returning();
		return updated;
	}

	/** 获取所有用户列表（超管功能） */
	async listUsers() {
		const allUsers = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt
			})
			.from(users)
			.orderBy(desc(users.createdAt));

		return allUsers.map((u) => ({
			id: u.id,
			name: u.name,
			email: u.email,
			role: u.role as UserRole,
			createdAt: u.createdAt?.toISOString() ?? new Date().toISOString()
		}));
	}

	/** 更新用户角色（超管功能） */
	async updateUserRole(userId: string, role: UserRole, operatorId: string) {
		// 不能修改自己的角色
		if (userId === operatorId) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "不能修改自己的角色"
			});
		}

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "用户不存在"
			});
		}

		const [updated] = await db
			.update(users)
			.set({ role })
			.where(eq(users.id, userId))
			.returning();

		return {
			id: updated.id,
			name: updated.name,
			email: updated.email,
			role: updated.role as UserRole,
			createdAt: updated.createdAt?.toISOString() ?? new Date().toISOString()
		};
	}

	/** 强制重置用户密码（超管功能） */
	async forceResetPassword(userId: string, newPassword: string, operatorId: string) {
		// 不能重置自己的密码（应该用个人设置）
		if (userId === operatorId) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "请通过个人设置修改自己的密码"
			});
		}

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "用户不存在"
			});
		}

		await db
			.update(users)
			.set({ passwordHash: newPassword })
			.where(eq(users.id, userId));

		return { success: true };
	}

	/** 删除用户（超管功能） */
	async deleteUser(userId: string, operatorId: string) {
		// 不能删除自己
		if (userId === operatorId) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "不能删除自己的账号"
			});
		}

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "用户不存在"
			});
		}

		// 不能删除其他超级管理员
		if (user.role === "superadmin") {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "不能删除超级管理员"
			});
		}

		await db.delete(users).where(eq(users.id, userId));
		return { success: true };
	}
}

export const adminService = new AdminService();
