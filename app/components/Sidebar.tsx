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

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    sessionStorage.clear();
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-[#031B2E] text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#031B2E] text-white flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Mobile Close */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center py-6 border-b border-white/10">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-5 space-y-3">
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
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

        {/* Bottom Section */}
        <div className="mt-auto">
          {/* Logout */}
          <div className="p-5 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600 transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-white/10 text-center">
            <p className="text-sm text-gray-300 font-medium">
              Right Work Decor India Pvt. Ltd.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              © 2026 All Rights Reserved
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}