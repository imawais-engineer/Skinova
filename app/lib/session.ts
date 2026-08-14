import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "skinova_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({ name: user.name, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getAuthSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    const id = payload.sub;

    if (!id || typeof id !== "string") {
      return null;
    }

    const name = typeof payload.name === "string" ? payload.name : "";
    const email = typeof payload.email === "string" ? payload.email : "";

    if (!name || !email) {
      return null;
    }

    return { id, name, email };
  } catch {
    return null;
  }
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
