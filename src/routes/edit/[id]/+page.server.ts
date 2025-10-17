import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

// Load the logged-in user by ID
export const load: PageServerLoad = async ({ locals, params }) => {
    // Redirect if no user is logged in
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.id, Number(params.id)));

	return { user };
};

// Actions to edit user
export const actions: Actions = {
	editUser: async ({ request, params }) => {
		const formData = await request.formData();
		const { id } = params;

		const name = formData.get('name') as string | null;
		const email = formData.get('email') as string | null;
		const phone = formData.get('phone') as string | null;

		await db
			.update(users)
			.set({
				name: name && name.trim() !== '' ? name : undefined,
				email: email && email.trim() !== '' ? email : undefined,
				phone: phone && phone.trim() !== '' ? phone : undefined
			})
			.where(eq(users.id, Number(id)));

		throw redirect(303, '/account');
	}
};