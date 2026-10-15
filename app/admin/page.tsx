import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata = {
  title: { absolute: "Portfolio Admin | Aimen Elwahab" },
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
