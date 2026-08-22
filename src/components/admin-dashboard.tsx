"use client";

import { FormEvent, useEffect, useState } from "react";
import { BookOpen, CheckCircle2, LoaderCircle, LogOut, Mail, RefreshCw, Save, ShieldCheck, Users } from "lucide-react";

type DashboardData = {
  adminEmail: string;
  pricing: { ebooks: Record<string, number>; services: Record<string, number | null>; updatedAt: string | null };
  ebooks: Array<{ id: string; title: string }>;
  services: Array<{ id: string; name: string; defaultPriceNaira: number | null }>;
  payments: Array<{ reference: string; ebookTitle: string; customerName: string; customerEmail: string; amountNaira: number; currency: string; paidAt: string | null; verifiedAt: string; deliveryStatus: string; downloadCount: number; maxDownloads: number; accessExpiresAt: string | null }>;
  leads: Array<{ id: string; name: string; company: string; email: string; phone: string; focus: string; source: string; submittedAt: string }>;
};

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value?: string | null) {
  return value ? new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Not provided";
}

export function AdminDashboard() {
  const [view, setView] = useState<"checking" | "login" | "code" | "dashboard">("checking");
  const [email, setEmail] = useState("Ukwun97@gmail.com");
  const [code, setCode] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [pricing, setPricing] = useState<DashboardData["pricing"] | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    const response = await fetch("/.netlify/functions/admin-dashboard", { headers: { Accept: "application/json" } });
    if (response.status === 401) {
      setView("login");
      return;
    }
    if (!response.ok) throw new Error("Unable to load the admin dashboard.");
    const result = await response.json();
    setData(result);
    setPricing(result.pricing);
    setView("dashboard");
  }

  useEffect(() => {
    queueMicrotask(() => {
      loadDashboard().catch((error) => {
        setMessage(error instanceof Error ? error.message : "Unable to load the admin dashboard.");
        setView("login");
      });
    });
  }, []);

  async function requestCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/.netlify/functions/admin-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "request-code", email }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send the code.");
      setView("code");
      setMessage("A six-digit sign-in code has been sent to the super-admin email.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send the code.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/.netlify/functions/admin-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify-code", email, code }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The code could not be verified.");
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The code could not be verified.");
    } finally {
      setBusy(false);
    }
  }

  async function savePricing(event: FormEvent) {
    event.preventDefault();
    if (!pricing) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/.netlify/functions/admin-dashboard", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update-pricing", pricing }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save prices.");
      setPricing(result.pricing);
      setData((current) => current ? { ...current, pricing: result.pricing } : current);
      setMessage("Pricing updated across the live website.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save prices.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyPayment(reference: string) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/.netlify/functions/admin-dashboard", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify-payment", reference }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Payment could not be verified.");
      setMessage("Payment verified and ebook delivery confirmed or retried.");
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment could not be verified.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/.netlify/functions/admin-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    setData(null);
    setPricing(null);
    setView("login");
  }

  if (view === "checking") return <div className="flex min-h-[50vh] items-center justify-center"><LoaderCircle className="animate-spin text-[#7cabff]" size={32} /></div>;

  if (view === "login" || view === "code") {
    return (
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-[#111111]/85 p-7 shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:p-9">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4f8cff]/12 text-[#7cabff]"><ShieldCheck size={22} /></span>
        <h1 className="mt-5 text-3xl font-semibold text-white">Super-admin access</h1>
        <p className="mt-3 leading-7 text-white/58">A short-lived sign-in code is sent only to the authorized super-admin email.</p>
        {view === "login" ? (
          <form onSubmit={requestCode} className="mt-7">
            <label className="text-sm text-white/65">Admin email
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none focus:border-[#4f8cff]/45" />
            </label>
            <button disabled={busy} className="btn-primary mt-5 w-full disabled:opacity-50">{busy ? <LoaderCircle size={16} className="animate-spin" /> : <Mail size={16} />} Email my sign-in code</button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="mt-7">
            <label className="text-sm text-white/65">Six-digit code
              <input inputMode="numeric" pattern="[0-9]{6}" required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-center text-2xl tracking-[0.35em] text-white outline-none focus:border-[#4f8cff]/45" />
            </label>
            <button disabled={busy || code.length !== 6} className="btn-primary mt-5 w-full disabled:opacity-50">{busy ? <LoaderCircle size={16} className="animate-spin" /> : <ShieldCheck size={16} />} Verify and continue</button>
          </form>
        )}
        {message ? <p role="status" className="mt-4 text-sm leading-6 text-[#d6b25e]">{message}</p> : null}
      </div>
    );
  }

  if (!data || !pricing) return null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Protected control room</p><h1 className="mt-2 text-4xl font-semibold text-white">Portfolio super-admin</h1><p className="mt-3 text-white/55">Signed in as {data.adminEmail}</p></div>
        <div className="flex gap-3"><button onClick={() => loadDashboard()} className="btn-secondary"><RefreshCw size={15} /> Refresh</button><button onClick={logout} className="btn-secondary"><LogOut size={15} /> Sign out</button></div>
      </div>

      {message ? <div role="status" className="mt-6 rounded-2xl border border-[#d6b25e]/20 bg-[#d6b25e]/8 px-5 py-4 text-sm text-[#ead394]">{message}</div> : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><BookOpen className="text-[#7cabff]" size={20} /><p className="mt-3 text-3xl font-semibold">{data.payments.length}</p><p className="text-sm text-white/50">recorded payments</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><Users className="text-[#7cabff]" size={20} /><p className="mt-3 text-3xl font-semibold">{data.leads.length}</p><p className="text-sm text-white/50">captured enquiries</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><CheckCircle2 className="text-emerald-300" size={20} /><p className="mt-3 text-3xl font-semibold">{data.payments.filter((payment) => payment.deliveryStatus === "delivered").length}</p><p className="text-sm text-white/50">ebooks delivered</p></div>
      </div>

      <form onSubmit={savePricing} className="mt-8 rounded-[2rem] border border-white/10 bg-[#111111]/82 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4"><div><h2 className="text-2xl font-semibold">Live pricing</h2><p className="mt-2 text-sm text-white/50">Changes are stored privately and reflected by the storefront and service pages immediately.</p></div><button disabled={busy} className="btn-primary shrink-0"><Save size={15} /> Save prices</button></div>
        <div className="mt-7 grid gap-8 lg:grid-cols-2">
          <div><h3 className="font-semibold text-[#d6b25e]">Ebooks</h3><div className="mt-4 space-y-3">{data.ebooks.map((ebook) => <label key={ebook.id} className="block text-sm text-white/65">{ebook.title}<input type="number" min="100" step="100" value={pricing.ebooks[ebook.id] ?? ""} onChange={(event) => setPricing({ ...pricing, ebooks: { ...pricing.ebooks, [ebook.id]: Number(event.target.value) } })} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#4f8cff]/45" /></label>)}</div></div>
          <div><h3 className="font-semibold text-[#d6b25e]">Services</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{data.services.map((service) => <label key={service.id} className="block text-sm text-white/65">{service.name}<input type="number" min="100" step="10000" placeholder="Custom quote" value={pricing.services[service.id] ?? ""} onChange={(event) => setPricing({ ...pricing, services: { ...pricing.services, [service.id]: event.target.value ? Number(event.target.value) : null } })} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#4f8cff]/45" /></label>)}</div></div>
        </div>
      </form>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#111111]/82 p-6 sm:p-8"><h2 className="text-2xl font-semibold">Payments and delivery</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[950px] text-left text-sm"><thead className="text-white/45"><tr><th className="pb-3">Customer</th><th className="pb-3">Ebook</th><th className="pb-3">Amount</th><th className="pb-3">Status</th><th className="pb-3">Downloads</th><th className="pb-3">Reference</th><th className="pb-3">Action</th></tr></thead><tbody>{data.payments.map((payment) => <tr key={payment.reference} className="border-t border-white/8"><td className="py-4"><p className="text-white">{payment.customerName}</p><p className="text-xs text-white/45">{payment.customerEmail}</p></td><td className="py-4 pr-4">{payment.ebookTitle}</td><td className="py-4">{formatNaira(payment.amountNaira)}</td><td className="py-4 capitalize">{payment.deliveryStatus}</td><td className="py-4">{payment.downloadCount} / {payment.maxDownloads || 5}</td><td className="py-4 font-mono text-xs">{payment.reference}</td><td className="py-4"><button disabled={busy} onClick={() => verifyPayment(payment.reference)} type="button" className="rounded-full border border-white/12 px-3 py-2 text-xs hover:border-[#4f8cff]/45">Verify / retry</button></td></tr>)}</tbody></table>{data.payments.length === 0 ? <p className="py-8 text-center text-white/45">No verified ebook payments have been recorded yet.</p> : null}</div></section>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#111111]/82 p-6 sm:p-8"><h2 className="text-2xl font-semibold">Users and enquiries</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="text-white/45"><tr><th className="pb-3">Name</th><th className="pb-3">Contact</th><th className="pb-3">Company</th><th className="pb-3">Need</th><th className="pb-3">Submitted</th></tr></thead><tbody>{data.leads.map((lead) => <tr key={lead.id} className="border-t border-white/8"><td className="py-4 text-white">{lead.name}</td><td className="py-4"><a href={`mailto:${lead.email}`} className="block hover:text-white">{lead.email}</a><a href={`tel:${lead.phone}`} className="text-xs text-white/45 hover:text-white">{lead.phone}</a></td><td className="py-4">{lead.company || "—"}</td><td className="py-4 capitalize">{lead.focus || "Not selected"}</td><td className="py-4">{formatDate(lead.submittedAt)}</td></tr>)}</tbody></table>{data.leads.length === 0 ? <p className="py-8 text-center text-white/45">No enquiries have been captured yet.</p> : null}</div></section>
    </div>
  );
}
