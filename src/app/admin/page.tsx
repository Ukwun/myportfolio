import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Super Admin | John Solace",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <main className="min-h-[70vh] px-5 py-16 sm:px-8 lg:px-10 lg:py-20"><AdminDashboard /></main>;
}
