"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import Sidebar from "../../components/Sidebar";

import {
  Settings,
  Save,
  KeyRound,
  Database,
} from "lucide-react";

export default function SettingsPage() {

  // ============================
  // Account & Security
  // ============================

  const [userId, setUserId] = useState("admin");

  const [registeredMobile, setRegisteredMobile] =
    useState("+919972534884");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [otpVerified, setOtpVerified] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ============================
  // Visitor Settings
  // ============================

  const [autoVisitorId, setAutoVisitorId] =
    useState(true);

  const [enableEdit, setEnableEdit] =
    useState(true);

  const [enableDelete, setEnableDelete] =
    useState(false);

  const [enableExcelExport, setEnableExcelExport] =
    useState(true);

  // ============================
  // Load Settings
  // ============================

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {

    const { data } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (!data) return;

    setUserId(data.user_id || "admin");

    setRegisteredMobile(
      data.owner_mobile || ""
    );

    setAutoVisitorId(
      data.auto_visitor_id ?? true
    );

    setEnableEdit(
      data.enable_edit ?? true
    );

    setEnableDelete(
      data.enable_delete ?? false
    );

    setEnableExcelExport(
      data.enable_excel_export ?? true
    );
  }

  // ============================
  // Save Settings
  // ============================

  async function saveSettings() {

    const { error } = await supabase
      .from("settings")
      .upsert({
        id: 1,
        user_id: userId,
        owner_mobile: registeredMobile,
        auto_visitor_id: autoVisitorId,
        enable_edit: enableEdit,
        enable_delete: enableDelete,
        enable_excel_export: enableExcelExport,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Settings Saved Successfully");
  }

  // ============================
  // OTP
  // ============================

  function sendOtp() {
    setOtpSent(true);
    alert("OTP Sent Successfully");
  }

  function verifyOtp() {

    if (otp === "123456") {
      setOtpVerified(true);
      alert("OTP Verified Successfully");
    } else {
      alert("Invalid OTP");
    }

  }

  // ============================
  // Update Password
  // ============================

  async function updatePassword() {

    if (!otpVerified) {
      alert("Please verify OTP first");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { error } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password Updated Successfully");
  }
  // ============================
// Backup Database
// ============================

async function backupDatabase() {
  const { data, error } = await supabase
    .from("visitors")
    .select("*");

  if (error) {
    alert(error.message);
    return;
  }

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    {
      type: "application/json",
    }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "visitor-backup.json";
  a.click();

  URL.revokeObjectURL(url);

  alert("Backup Completed");
}

// ============================
// Restore Database
// ============================

async function restoreDatabase(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  const text = await file.text();

  const visitors = JSON.parse(text);

  const { error } = await supabase
    .from("visitors")
    .upsert(visitors);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Database Restored Successfully");
}

return (
  <div className="flex min-h-screen bg-gray-100">

    <Sidebar />

    <div className="flex-1 lg:ml-72 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#031B2E] mb-8">
          Settings
        </h1>

        {/* ========================= */}
        {/* Account & Security */}
        {/* ========================= */}

        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <KeyRound
              className="text-[#031B2E]"
              size={28}
            />

            <h2 className="text-xl md:text-2xl font-bold">
              Account & Security
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-semibold">
                User ID
              </label>

              <input
                type="text"
                value={userId}
                onChange={(e)=>setUserId(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Registered Mobile
              </label>

              <input
                type="text"
                value={registeredMobile}
                onChange={(e)=>setRegisteredMobile(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e)=>setCurrentPassword(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                OTP
              </label>

              <input
                type="text"
                value={otp}
                onChange={(e)=>setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full border rounded-xl p-3"
              />
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">

            <button
              onClick={sendOtp}
              className="w-full sm:w-auto bg-[#031B2E] text-white px-5 py-3 rounded-xl"
            >
              Send OTP
            </button>

            <button
              onClick={verifyOtp}
              className="w-full sm:w-auto bg-green-600 text-white px-5 py-3 rounded-xl"
            >
              Verify OTP
            </button>

            <button
              onClick={updatePassword}
              className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-xl"
            >
              Update Password
            </button>

          </div>

        </div>
        {/* ========================= */}
        {/* Visitor Settings */}
        {/* ========================= */}

        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mb-6">

          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-[#031B2E]" size={28} />

            <h2 className="text-xl md:text-2xl font-bold">
              Visitor Settings
            </h2>
          </div>

          <div className="space-y-5">

            <label className="flex justify-between items-center border rounded-xl p-4">
              <span className="font-semibold">
                Auto Generate Visitor ID
              </span>

              <input
                type="checkbox"
                checked={autoVisitorId}
                onChange={(e) => setAutoVisitorId(e.target.checked)}
                className="w-5 h-5"
              />
            </label>

            <label className="flex justify-between items-center border rounded-xl p-4">
              <span className="font-semibold">
                Enable Edit Visitor
              </span>

              <input
                type="checkbox"
                checked={enableEdit}
                onChange={(e) => setEnableEdit(e.target.checked)}
                className="w-5 h-5"
              />
            </label>

            <label className="flex justify-between items-center border rounded-xl p-4">
              <span className="font-semibold">
                Enable Delete Visitor
              </span>

              <input
                type="checkbox"
                checked={enableDelete}
                onChange={(e) => setEnableDelete(e.target.checked)}
                className="w-5 h-5"
              />
            </label>

            <label className="flex justify-between items-center border rounded-xl p-4">
              <span className="font-semibold">
                Enable Excel Export
              </span>

              <input
                type="checkbox"
                checked={enableExcelExport}
                onChange={(e) => setEnableExcelExport(e.target.checked)}
                className="w-5 h-5"
              />
            </label>

          </div>

        </div>

        {/* ========================= */}
        {/* Database */}
        {/* ========================= */}

        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mb-6">

          <div className="flex items-center gap-3 mb-6">
            <Database className="text-[#031B2E]" size={28} />

            <h2 className="text-xl md:text-2xl font-bold">
              Database
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <button
              onClick={backupDatabase}
              className="w-full border rounded-xl py-4 font-semibold hover:bg-gray-100 transition"
            >
              Backup Database
            </button>

            <>
              <input
                id="restore-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={restoreDatabase}
              />

              <button
                onClick={() =>
                  document
                    .getElementById("restore-file")
                    ?.click()
                }
                className="w-full border rounded-xl py-4 font-semibold hover:bg-gray-100 transition"
              >
                Restore Database
              </button>
            </>

          </div>

        </div>

        {/* ========================= */}
        {/* Save Settings */}
        {/* ========================= */}

        <div className="flex justify-end">

          <button
            onClick={saveSettings}
            className="w-full sm:w-auto bg-[#031B2E] hover:bg-[#0B4EA2] text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold transition"
          >
            <Save size={22} />
            Save Settings
          </button>

        </div>

      </div>
    </div>
  </div>
);
}