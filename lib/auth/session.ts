import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionUser } from "@/types";

export interface SessionData {
  isAuth: boolean;
  isDemo: boolean;
  user?: SessionUser;
  sessionId?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: process.env.COOKIE_NAME || "meemeals_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict" as const,
    maxAge: 60 * 30, // 30 minutes
  },
};

export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  // Initialize default values if not set
  if (session.isAuth === undefined) {
    session.isAuth = false;
  }
  if (session.isDemo === undefined) {
    session.isDemo = false;
  }

  return session;
}

export async function createSession(
  user: SessionUser,
  isDemo: boolean = false
): Promise<SessionData> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  session.isAuth = true;
  session.isDemo = isDemo;
  session.user = user;
  session.sessionId = crypto.randomUUID();

  await session.save();

  return session;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  session.destroy();
}
