import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { findUserById } from "./db";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isValidEmail,
  verifySessionToken,
  type SessionUser
} from "./session";

export { SESSION_COOKIE, isValidEmail, type SessionUser } from "./session";
export { verifySessionToken } from "./session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);

  if (!session) {
    return null;
  }

  const user = await findUserById(session.id);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}
