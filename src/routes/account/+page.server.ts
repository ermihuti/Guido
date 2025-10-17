import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect if no user is logged in
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Select only the logged-in user
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.id, locals.user.id));

	// If user not found (shouldn’t happen)
	if (!user) {
		throw redirect(302, '/login');
	}

	return { user };
};