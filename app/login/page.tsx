"use client";

import Popup from "@/app/components/Popup";
import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  // ===============================
  // AUTO LOGIN + 1 HOUR SESSION
  // ===============================

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const lastActivity = Number(
      localStorage.getItem("lastActivity")
    );

    if (admin === "true") {
      const now = Date.now();

      if (
        lastActivity &&
        now - lastActivity < 60 * 60 * 1000
      ) {
        router.replace("/admin/dashboard");
      } else {
        localStorage.clear();
      }
    }
  }, [router]);

  // ===============================
  // STATES
  // ===============================

  const [userId, setUserId] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  // ===============================
  // POPUP
  // ===============================

  const [popup, setPopup] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  // ===============================
  // FORGOT PASSWORD
  // ===============================

  const [forgotOpen, setForgotOpen] =
    useState(false);

  const [mobile, setMobile] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [otpVerified, setOtpVerified] =
    useState(false);
    // ===============================
  // LOGIN
  // ===============================

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .eq("password", password)
      .single();

    setLoading(false);

    if (error || !data) {
      setPopup({
        open: true,
        type: "error",
        title: "Login Failed",
        message: "Invalid User ID or Password",
      });
      return;
    }

    if (!data.is_active) {
      setPopup({
        open: true,
        type: "warning",
        title: "Account Disabled",
        message:
          "Please contact administrator.",
      });
      return;
    }

    localStorage.setItem("admin", "true");
    localStorage.setItem(
      "adminId",
      data.id.toString()
    );
    localStorage.setItem(
      "userId",
      data.user_id
    );

    localStorage.setItem(
      "lastActivity",
      Date.now().toString()
    );

    if (rememberMe) {
      localStorage.setItem(
        "rememberUser",
        userId
      );
    }

    setPopup({
      open: true,
      type: "success",
      title: "Login Successful",
      message:
        "Welcome to RWD TOSTEM Visitor Management System",
    });

    setTimeout(() => {
      router.replace("/admin/dashboard");
    }, 1200);
  };

  // ===============================
  // SEND OTP
  // ===============================

  function sendOtp() {

  if (!userId || !mobile) {
    setPopup({
      open: true,
      type: "warning",
      title: "Required",
      message: "Please enter User ID and Mobile Number.",
    });
    return;
  }

  // Allow only registered admin
  if (
    userId !== "admin" ||
    mobile !== "9972534884"
  ) {
    setPopup({
      open: true,
      type: "error",
      title: "Invalid Details",
      message: "User ID or Mobile Number is incorrect.",
    });
    return;
  }

  setOtpSent(true);

  setPopup({
    open: true,
    type: "success",
    title: "OTP Sent Successfully",
    message: "Please enter the OTP received on your registered mobile number.",
  });

}

  // ===============================
  // VERIFY OTP
  // ===============================

  function verifyOtp() {

    if (otp !== "123456") {

      setPopup({
        open: true,
        type: "error",
        title: "Invalid OTP",
        message:
          "Please enter valid OTP.",
      });

      return;

    }

    setOtpVerified(true);

    setPopup({
      open: true,
      type: "success",
      title: "Verified",
      message:
        "OTP Verified Successfully.",
    });

  }

  // ===============================
  // UPDATE PASSWORD
  // ===============================

  async function updatePassword() {

    if (!otpVerified) {

      setPopup({
        open: true,
        type: "warning",
        title: "OTP Required",
        message:
          "Please verify OTP first.",
      });

      return;

    }

    if (newPassword !== confirmPassword) {

      setPopup({
        open: true,
        type: "error",
        title: "Password Mismatch",
        message:
          "Confirm Password does not match.",
      });

      return;

    }

    const { error } = await supabase
      .from("admin_users")
      .update({
        password: newPassword,
      })
      .eq("user_id", userId);

    if (error) {

      setPopup({
        open: true,
        type: "error",
        title: "Update Failed",
        message: error.message,
      });

      return;

    }

    setForgotOpen(false);

    setPopup({
      open: true,
      type: "success",
      title: "Success",
      message:
        "Password Updated Successfully.",
    });

  };

  return (

  <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 flex items-center justify-center p-2 lg:p-4">

  <div className="w-full max-w-6xl h-[88vh] bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

    {/* ================= LEFT SIDE ================= */}

    <div className="hidden lg:flex flex-col items-center bg-gradient-to-br from-[#022B46] via-[#005F87] to-[#0093B8] text-white pt-10 pb-8 px-8">

      <Image
        src="/logo.png"
        alt="Logo"
        width={170}
        height={170}
        priority
        className="mt-2"
      />

      <h1 className="text-4xl font-bold mt-4 tracking-wide">
        RWD TOSTEM
      </h1>

      <p className="text-xl mt-1">
        Visitor Management System
      </p>

      <div className="w-32 h-1 bg-white/40 rounded-full my-8"></div>

      <p className="text-lg font-medium">
        Smart • Secure • Professional
      </p>

      <div className="mt-1 space-y-1 text-lg">

        <div className="flex items-center gap-3">
          <ShieldCheck size={15}/>
          <span>Secure Login</span>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle2 size={15}/>
          <span>Visitor Management</span>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle2 size={15}/>
          <span>Real-time Dashboard</span>
        </div>

      </div>

    </div>

    {/* ================= RIGHT SIDE ================= */}

    <div className="flex items-center justify-center p-5 lg:p-8">

      <div className="w-full max-w-sm">

        {/* Mobile Logo */}

        <div className="flex justify-center lg:hidden mb-5">

          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
          />

        </div>

        <h1 className="text-4xl font-bold text-center text-[#022B46]">
          Admin Login
        </h1>

        <div className="w-20 h-1 bg-[#006D84] rounded-full mx-auto my-5"></div>

        <p className="text-center text-gray-500 mb-8">
          Welcome to RWD TOSTEM Visitor Management System
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* USER ID */}

          <div>

            <label className="font-semibold block mb-2">
              User ID
            </label>

            <div className="relative">

              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#006D84]"
              />

              <input
                type="text"
                value={userId}
                onChange={(e)=>setUserId(e.target.value)}
                placeholder="Enter User ID"
                required
                className="w-full h-12 border-2 border-gray-200 rounded-xl pl-12 pr-4 outline-none focus:border-[#006D84] focus:ring-4 focus:ring-cyan-100"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div>

            <label className="font-semibold block mb-2">
              Password
            </label>

            <div className="relative">

              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#006D84]"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="w-full h-12 border-2 border-gray-200 rounded-xl pl-12 pr-12 outline-none focus:border-[#006D84] focus:ring-4 focus:ring-cyan-100"
              />

              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff/> : <Eye/>}
              </button>

            </div>

          </div>

          <div className="flex justify-between items-center text-sm">

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={()=>setRememberMe(!rememberMe)}
              />

              Remember Me

            </label>

            <button
              type="button"
              onClick={()=>setForgotOpen(true)}
              className="text-[#006D84] hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#006D84] to-[#0B4EA2] text-white font-bold flex items-center justify-center gap-2"
          >
            <LogIn size={20}/>
            {loading ? "Signing In..." : "Login"}
          </button>
          </form>

        {/* Footer */}

        <div className="border-t mt-8 pt-5 text-center">

          <p className="text-gray-500 text-sm">
            Right Work Decor India Pvt. Ltd.
          </p>

        </div>

      </div>

    </div>

  </div>

  {/* =========================
      FORGOT PASSWORD POPUP
  ========================= */}

  {forgotOpen && (

    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">

        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e)=>setUserId(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Registered Mobile Number"
            value={mobile}
            onChange={(e)=>setMobile(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          {!otpSent ? (

            <button
              onClick={sendOtp}
              className="w-full bg-[#006D84] text-white py-3 rounded-xl"
            >
              Send OTP
            </button>

          ) : (

            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e)=>setOtp(e.target.value)}
                className="w-full border rounded-xl p-3"
              />

              {!otpVerified ? (

                <button
                  onClick={verifyOtp}
                  className="w-full bg-green-600 text-white py-3 rounded-xl"
                >
                  Verify OTP
                </button>

              ) : (

                <>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e)=>setNewPassword(e.target.value)}
                    className="w-full border rounded-xl p-3"
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    className="w-full border rounded-xl p-3"
                  />

                  <button
                    onClick={updatePassword}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl"
                  >
                    Update Password
                  </button>
                </>

              )}

            </>

          )}

          <button
            onClick={()=>setForgotOpen(false)}
            className="w-full border py-3 rounded-xl"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  )}

  <Popup
    open={popup.open}
    type={popup.type as any}
    title={popup.title}
    message={popup.message}
    onClose={() =>
      setPopup((prev)=>({
        ...prev,
        open:false,
      }))
    }
  />

</div>

  );
}