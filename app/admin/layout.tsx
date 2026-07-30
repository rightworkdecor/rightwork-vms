"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = localStorage.getItem("admin");

    if (admin !== "true") {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[200px] flex-1 p-6 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}