import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import bcrypt from 'bcrypt';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
 const bytes = crypto.getRandomValues(new Uint8Array(18));
 return encodeBase64url(bytes);
}

export async function createSession(token: string, user_id: number) {
 const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
 const session = {
  id: sessionId,
  user_id,
  expires_at: new Date(Date.now() + DAY_IN_MS * 30)
 };
 await db.insert(table.session).values(session);
 return session;
}

// ---------- LOGIN ----------
export async function login(email: string, password: string) {
 const [user] = await db.select().from(table.users).where(eq(table.users.email, email));
 if (!user) return null;

 const valid = await bcrypt.compare(password, user.password_hash);
 if (!valid) return null;

 const token = generateSessionToken();
 await createSession(token, user.id);
 return token;
}

// ---------- SIGNUP ----------
export async function signup(name: string, email: string, password: string, phone: string) {
 const existing = await db.select().from(table.users).where(eq(table.users.email, email));
 if (existing.length > 0) return null;

 const password_hash = await bcrypt.hash(password, 10);

 const [user] = await db
  .insert(table.users)
  .values({
   name,
   email,
   password_hash,
   phone,
   role: 'client'
  })
  .$returningId();

 const token = generateSessionToken();
 await createSession(token, user.id);
 return token;
}

// ---------- SESSION VALIDATION ----------
export async function validateSessionToken(token: string) {
 const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
 const [result] = await db
  .select({
   user: { id: table.users.id, email: table.users.email },
   session: table.session
  })
  .from(table.session)
  .innerJoin(table.users, eq(table.session.user_id, table.users.id))
  .where(eq(table.session.id, sessionId));

 if (!result) return { session: null, user: null };

 const { session, user } = result;
 const now = Date.now();

 if (now >= session.expires_at.getTime()) {
  await db.delete(table.session).where(eq(table.session.id, session.id));
  return { session: null, user: null };
 }

 if (now >= session.expires_at.getTime() - DAY_IN_MS * 15) {
  session.expires_at = new Date(now + DAY_IN_MS * 30);
  await db
   .update(table.session)
   .set({ expires_at: session.expires_at })
   .where(eq(table.session.id, session.id));
 }

 return { session, user };
}

export async function invalidateSession(sessionId: string) {
 await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
 event.cookies.set(sessionCookieName, token, { expires: expiresAt, path: '/' });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
 event.cookies.delete(sessionCookieName, { path: '/' });
}