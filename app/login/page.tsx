"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
  if (localStorage.getItem("admin") === "true") {
    router.replace("/admin/dashboard");
  }
}, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      email === "admin@tostem.com" &&
      password === "123456"
    ) {
      localStorage.setItem("admin", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-cyan-50 flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10">

        {/* Logo */}

        <div className="flex justify-center mb-5">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        {/* Heading */}

        <h1 className="text-5xl font-bold text-center">
          Admin Login
        </h1>

        <div className="w-20 h-1 bg-cyan-700 mx-auto rounded-full my-5"></div>

        <p className="text-center text-gray-500 mb-10 text-lg">
          RWD TOSTEM Visitor Management System
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}

          <div>
            <label className="font-semibold">
              Email ID
            </label>

            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-700" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 border rounded-xl pl-12 pr-4 text-lg outline-none focus:border-cyan-700"
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label className="font-semibold">
              Password
            </label>

            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-700" />

              <input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
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

          {/* Remember */}

          <div className="flex justify-between items-center">

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-5 h-5 accent-cyan-700"
              />

              Remember me

            </label>

            <button
              type="button"
              className="text-cyan-700 font-medium"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login */}

          <button
            type="submit"
            className="w-full h-14 bg-[#006D84] hover:bg-[#00596C] rounded-xl text-white font-bold text-xl flex justify-center items-center gap-3"
          >
            <LogIn size={22} />
            Login
          </button>

        </form>

        <div className="border-t mt-10 pt-6 text-center text-gray-500">
          © 2026 Right Work Decor India Pvt. Ltd.
        </div>

      </div>

    </div>
  );
}