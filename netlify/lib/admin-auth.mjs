import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_EMAIL = "ukwun97@gmail.com";
export const ADMIN_COOKIE = "portfolio_admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-admin-session-secret-local-only";
}

function isSecureCookieEnvironment() {
  return typeof process !== "undefined" && process.env.NODE_ENV === "production";
}

function sign(value) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createAdminSession() {
  const payload = Buffer.from(JSON.stringify({ email: ADMIN_EMAIL, exp: Date.now() + 8 * 60 * 60 * 1000, nonce: randomBytes(12).toString("hex") })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function adminSessionCookie(token) {
  const secure = isSecureCookieEnvironment() ? "; Secure" : "";
  return `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${secure}`;
}

export function clearAdminSessionCookie() {
  const secure = isSecureCookieEnvironment() ? "; Secure" : "";
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function getAdminEmail(request) {
  if (!getSecret()) return null;
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_COOKIE}=`))?.slice(ADMIN_COOKIE.length + 1);
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return parsed.email === ADMIN_EMAIL && Number(parsed.exp) > Date.now() ? ADMIN_EMAIL : null;
  } catch {
    return null;
  }
}

export function hashLoginCode(code) {
  if (!getSecret()) throw new Error("Admin session secret is not configured");
  return createHmac("sha256", getSecret()).update(`${ADMIN_EMAIL}:${code}`).digest("hex");
}

export function hashesMatch(received, expected) {
  return Boolean(received && expected && received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected)));
}
