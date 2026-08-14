import { NextRequest, NextResponse } from "next/server";
import { createSession, isValidEmail, verifyPassword } from "../../../lib/auth";
import { findUserByEmail } from "../../../lib/db";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const user = findUserByEmail(email);

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email
  });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}
