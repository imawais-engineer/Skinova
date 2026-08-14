import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSession, hashPassword, isValidEmail } from "../../../lib/auth";
import { createUser, findUserByEmail } from "../../../lib/db";

export async function POST(request: NextRequest) {
  let body: { name?: string; email?: string; password?: string; confirmPassword?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const confirmPassword = body.confirmPassword || password;

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  if (await findUserByEmail(email)) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({
    id: randomUUID(),
    name,
    email,
    passwordHash
  });

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email
  });

  return NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    },
    { status: 201 }
  );
}
