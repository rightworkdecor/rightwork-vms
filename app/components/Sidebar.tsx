"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileBarChart2,
  Settings,
  LogOut,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Visitors",
    href: "/admin/visitors",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem("admin");
  localStorage.removeItem("token");
  sessionStorage.clear();

  router.replace("/login");
  router.refresh();
};

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-[#031B2E] text-white flex flex-col">
      <div className="flex justify-center items-center py-6 border-b border-white/10">
  <img
    src="/logo.png"
    alt="Logo"
    className="w-25 h-25 object-contain bg-transparent"
  />
</div>
      <nav className="flex-1 p-5 space-y-3 overflow-hidden">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                pathname === item.href
                  ? "bg-[#0B4EA2]"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-white/10">
  <button
  onClick={handleLogout}
  className="w-full flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-600 transition"
>
  <LogOut size={20} />
  <span>Logout</span>
</button>
</div>

      <div className="p-5 border-t border-white/10 text-sm text-gray-400">
        © 2026 Right Work Decor
      </div>
    </aside>
  );
}