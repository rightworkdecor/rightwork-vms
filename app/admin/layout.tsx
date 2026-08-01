import "../globals.css";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="p-4 md:p-6 lg:ml-[200px]">
  {children}
</main>
    </div>
  );
}