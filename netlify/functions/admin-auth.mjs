import { randomInt } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { ADMIN_EMAIL, adminSessionCookie, clearAdminSessionCookie, createAdminSession, hashLoginCode, hashesMatch } from "../lib/admin-auth.mjs";

const handler = async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.action === "logout") {
    return Response.json({ authenticated: false }, { headers: { "Set-Cookie": clearAdminSessionCookie() } });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (body.action === "request-code") {
    if (email !== ADMIN_EMAIL) return Response.json({ sent: true });
    const secret = process.env.ADMIN_SESSION_SECRET;
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.ADMIN_FROM_EMAIL || process.env.LEAD_FROM_EMAIL || process.env.EBOOK_FROM_EMAIL;
    if (!secret || !apiKey || !from) return Response.json({ error: "Admin login is not configured." }, { status: 503 });

    const store = getStore({ name: "admin-auth", consistency: "strong" });
    const existing = await store.get("login-code", { type: "json" });
    if (existing?.requestedAt && Date.now() - Number(existing.requestedAt) < 60000) return Response.json({ sent: true });

    const code = String(randomInt(100000, 1000000));
    await store.setJSON("login-code", { hash: hashLoginCode(code), expiresAt: Date.now() + 10 * 60 * 1000, requestedAt: Date.now(), attempts: 0 });

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [ADMIN_EMAIL],
        subject: "Your John Solace portfolio admin code",
        html: `<div style="font-family:Arial,sans-serif;color:#17191e"><h1 style="font-size:24px">Admin sign-in code</h1><p>Use this code to access the portfolio dashboard:</p><p style="font-size:32px;font-weight:700;letter-spacing:8px">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`,
      }),
    });
    if (!response.ok) return Response.json({ error: "Unable to send the admin code." }, { status: 502 });
    return Response.json({ sent: true });
  }

  if (body.action === "verify-code") {
    if (email !== ADMIN_EMAIL || !/^\d{6}$/.test(String(body.code || ""))) return Response.json({ error: "Invalid or expired code." }, { status: 401 });
    const store = getStore({ name: "admin-auth", consistency: "strong" });
    const record = await store.get("login-code", { type: "json" });
    if (!record || Number(record.expiresAt) < Date.now() || Number(record.attempts) >= 5) return Response.json({ error: "Invalid or expired code." }, { status: 401 });
    const receivedHash = hashLoginCode(String(body.code));
    if (!hashesMatch(receivedHash, record.hash)) {
      await store.setJSON("login-code", { ...record, attempts: Number(record.attempts || 0) + 1 });
      return Response.json({ error: "Invalid or expired code." }, { status: 401 });
    }
    await store.delete("login-code");
    return Response.json({ authenticated: true, email: ADMIN_EMAIL }, { headers: { "Set-Cookie": adminSessionCookie(createAdminSession()) } });
  }

  return Response.json({ error: "Unsupported action" }, { status: 400 });
};

export default handler;
export const config = { path: "/.netlify/functions/admin-auth" };
