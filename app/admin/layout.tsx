"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    updateActivity();

    window.addEventListener("click", updateActivity);
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("scroll", updateActivity);

    const interval = setInterval(() => {
      const lastActivity = Number(
        localStorage.getItem("lastActivity") || "0"
      );

      if (Date.now() - lastActivity > 3600000) {
        localStorage.clear();
        sessionStorage.clear();
        router.replace("/login");
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <main
        className="
          w-full
          p-4
          sm:p-6
          lg:ml-[200px]
          lg:w-[calc(100%-200px)]
        "
      >
        {children}
      </main>
    </div>
  );
}