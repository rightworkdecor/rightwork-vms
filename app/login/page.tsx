"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("admin") === "true") {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .eq("password", password)
      .single();

    if (error || !data) {
      alert("Invalid User ID or Password");
      return;
    }

    if (!data.is_active) {
      alert("Account Disabled");
      return;
    }

    localStorage.setItem("admin", "true");
    localStorage.setItem("adminId", data.id.toString());
    localStorage.setItem("userId", data.user_id);

    if (remember) {
      localStorage.setItem("rememberUser", userId);
    }

    alert("Login Successful");

    router.replace("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-cyan-50 flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10">

        <div className="flex justify-center mb-5">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
          />
        </div>

        <h1 className="text-5xl font-bold text-center">
          Admin Login
        </h1>

        <div className="w-20 h-1 bg-cyan-700 mx-auto rounded-full my-5"></div>

        <p className="text-center text-gray-500 mb-10">
          RWD TOSTEM Visitor Management System
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="font-semibold">
              User ID
            </label>

            <div className="relative mt-2">

              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-700" />

              <input
                type="text"
                required
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full h-14 border rounded-xl pl-12 pr-4 text-lg outline-none focus:border-cyan-700"
              />

            </div>
          </div>

          <div>

            <label className="font-semibold">
              Password
            </label>

            <div className="relative mt-2">

              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-700" />

              <input
                type={show ? "text" : "password"}
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 border rounded-xl pl-12 pr-14 text-lg outline-none focus:border-cyan-700"
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {show ? <EyeOff /> : <Eye />}
              </button>

            </div>

          </div>

          <div className="flex justify-between items-center">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember Me
            </label>

            <button
              type="button"
              className="text-cyan-700"
            >
              Forgot Password?
            </button>

          </div>

          <button
            type="submit"
            className="w-full h-14 bg-[#006D84] hover:bg-[#00596C] rounded-xl text-white text-xl font-bold flex items-center justify-center gap-2"
          >
            <LogIn size={22} />
            Login
          </button>

        </form>

        <div className="border-t mt-8 pt-5 text-center text-gray-500">
          © 2026 Right Work Decor India Pvt. Ltd.
        </div>

      </div>

    </div>
  );
}