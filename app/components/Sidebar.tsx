"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
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

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    sessionStorage.clear();

    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Header */}

      <div className="lg:hidden flex items-center justify-between bg-[#031B2E] text-white px-4 py-3 shadow-lg sticky top-0 z-50">

        <img
          src="/logo.png"
          alt="Logo"
          className="h-10 w-auto"
        />

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Sidebar */}

      <aside
        className={`
        fixed top-0 left-0 z-50
        h-screen
        w-72
        bg-[#031B2E]
        text-white
        flex flex-col
        shadow-2xl
        transition-transform
        duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Logo */}

        <div className="flex justify-center items-center py-8 border-b border-white/10">

          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 h-28 object-contain"
          />

        </div>

        {/* Navigation */}

        <nav className="flex-1 px-5 py-6 space-y-3 overflow-y-auto">
          {menus.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                pathname === item.href
                  ? "bg-[#0B4EA2] shadow-lg"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon size={22} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}

      <div className="p-5 border-t border-white/10">

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 py-3 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

      {/* Footer */}

      <div className="p-5 border-t border-white/10 text-center text-xs text-gray-400">
        © 2026 Right Work Decor
      </div>

    </aside>

    {/* Mobile Overlay */}

    {open && (
      <div
        className="fixed inset-0 bg-black/50 lg:hidden z-40"
        onClick={() => setOpen(false)}
      />
    )}
  </>
);
}