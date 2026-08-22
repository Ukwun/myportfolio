import { randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";

const OWNER_EMAIL = "ukwun97@gmail.com";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

const handler = async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let input;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const lead = {
    id: randomUUID(),
    name: String(input.name || "").trim().slice(0, 120),
    company: String(input.company || "").trim().slice(0, 160),
    email: String(input.email || "").trim().toLowerCase().slice(0, 200),
    phone: String(input.phone || "").trim().slice(0, 80),
    focus: String(input.focus || "").trim().slice(0, 120),
    source: String(input.source || "Portfolio website").trim().slice(0, 160),
    submittedAt: new Date().toISOString(),
  };

  if (!lead.email || !lead.phone || !lead.name) return Response.json({ error: "Missing required lead details" }, { status: 400 });

  const store = getStore({ name: "portfolio-leads", consistency: "strong" });
  await store.setJSON(`${Date.now()}-${lead.id}`, lead);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return Response.json({ stored: true, notified: false, reason: "Email provider is not configured" }, { status: 202 });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL || process.env.EBOOK_FROM_EMAIL || "Portfolio Leads <onboarding@resend.dev>",
      to: [OWNER_EMAIL],
      reply_to: lead.email,
      subject: `New portfolio lead: ${lead.name}${lead.company ? ` — ${lead.company}` : ""}`,
      html: `<h2>New portfolio enquiry</h2><p><strong>Name:</strong> ${escapeHtml(lead.name)}</p><p><strong>Company:</strong> ${escapeHtml(lead.company || "Not provided")}</p><p><strong>Email:</strong> ${escapeHtml(lead.email)}</p><p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p><p><strong>Primary need:</strong> ${escapeHtml(lead.focus || "Not selected")}</p><p><strong>Source:</strong> ${escapeHtml(lead.source)}</p><p><strong>Submitted:</strong> ${escapeHtml(lead.submittedAt)}</p>`,
    }),
  });

  if (!response.ok) return Response.json({ stored: true, notified: false }, { status: 502 });
  return Response.json({ stored: true, notified: true });
};

export default handler;
export const config = { path: "/.netlify/functions/lead-alert" };
