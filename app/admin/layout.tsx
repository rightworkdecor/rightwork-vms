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

      // 1 Hour = 3600000 ms
      if (Date.now() - lastActivity > 3600000) {
        localStorage.clear();
        sessionStorage.clear();

        localStorage.clear();
sessionStorage.clear();
router.replace("/login");

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
    <>
      <Sidebar />
      <main style={{ marginLeft: "200px", padding: "24px" }}>
        {children}
      </main>
    </>
  );
}