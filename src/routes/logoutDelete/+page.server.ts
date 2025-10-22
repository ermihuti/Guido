import { db } from '$lib/server/db';
import { session, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	logout: async ({ locals, cookies }) => {
		if (!locals.user) {
			throw redirect(302, '/');
		}

		await db.delete(session).where(eq(session.user_id, locals.user.id));

		cookies.delete('session', { path: '/' });
		throw redirect(302, '/');
	},

	deleteAcc: async ({ locals, cookies }) => {
		if (!locals.user) {
			throw redirect(302, '/');
		}

		await db.delete(users).where(eq(users.id, locals.user.id));

		cookies.delete('session', { path: '/' });
		throw redirect(302, '/');
	}
};