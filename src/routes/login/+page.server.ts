import type { Actions } from './$types';
import { login, setSessionTokenCookie } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/auth';

export const load = async ({ cookies }) => {
  const token = cookies.get('auth-session');

  if (token) {
    const { user } = await validateSessionToken(token);
    if (user) {
      // User is already logged in, redirect to homepage
      throw redirect(302, '/');
    }
  }

  // If no valid session, allow page to load
  return {};
};

export const actions: Actions = {
 login: async ({ request, cookies }) => {
  const data = await request.formData();
  const email = data.get('email') as string;
  const password = data.get('password') as string;

  const token = await login(email, password);

  if (token) {
   const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
   setSessionTokenCookie({ cookies } as any, token, expires);
   throw redirect(302, '/');
  }

  return {
   success: false,
   message: 'Login failed. Please check your email and password.'
  };
 }
};