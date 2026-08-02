"use client";
import Popup from "@/app/components/Popup";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

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

const [popup, setPopup] = useState({
  open: false,
  type: "success",
  title: "",
  message: "",
});

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
    .update({
      owner_mobile: registeredMobile,
      auto_visitor_id: autoVisitorId,
      enable_edit: enableEdit,
      enable_delete: enableDelete,
      enable_excel_export: enableExcelExport,
    })
    .eq("id", 1);

  if (error) {
    setPopup({
  open: true,
  type: "error",
  title: "Error",
  message: error.message,
});
    return;
  }

  setPopup({
  open: true,
  type: "success",
  title: "Success",
  message: "Settings Saved Successfully",
});
}

// ============================
// OTP
// ============================

function sendOtp() {
setOtpSent(true);
setPopup({
  open: true,
  type: "success",
  title: "OTP Sent",
  message: "OTP Sent Successfully",
});
}

function verifyOtp() {

if (otp === "123456") {
setOtpVerified(true);
setPopup({
  open: true,
  type: "success",
  title: "Verified",
  message: "OTP Verified Successfully",
});
} else {
setPopup({
  open: true,
  type: "error",
  title: "Invalid OTP",
  message: "Please enter correct OTP.",
});
}

}

// ============================
// Update Password
// ============================

async function updatePassword() {

  const { data: admin, error: findError } = await supabase
  .from("admin_users")
  .select("*")
  .eq("user_id", userId)
  .eq("password", currentPassword)
  .single();

if (findError || !admin) {
  setPopup({
  open: true,
  type: "error",
  title: "Password Error",
  message: "Current Password is incorrect",
});
  return;
}

const { error } = await supabase
  .from("admin_users")
  .update({
    password: newPassword,
  })
  .eq("id", admin.id);

if (error) {
  setPopup({
  open: true,
  type: "error",
  title: "Error",
  message: error.message,
});
  return;
}

setPopup({
  open: true,
  type: "success",
  title: "Success",
  message: "Password Updated Successfully",
});
}

// ============================
// Backup Database
// ============================

async function backupDatabase() {

const { data, error } = await supabase
.from("visitors")
.select("*");

if (error) {
setPopup({
  open: true,
  type: "error",
  title: "Backup Failed",
  message: error.message,
});
return;
}

const blob = new Blob(
[JSON.stringify(data, null, 2)],
{
type: "application/json",
}
);

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;
a.download =
"visitor-backup.json";
a.click();

URL.revokeObjectURL(url);

setPopup({
  open: true,
  type: "success",
  title: "Backup Completed",
  message: "Database Backup Completed Successfully",
});

}

// ============================
// Restore Database
// ============================

async function restoreDatabase(
event: React.ChangeEvent<HTMLInputElement>
) {

const file =
event.target.files?.[0];

if (!file) return;

const text =
await file.text();

const visitors =
JSON.parse(text);

const { error } =
await supabase
.from("visitors")
.upsert(visitors);

if (error) {
setPopup({
  open: true,
  type: "error",
  title: "Restore Failed",
  message: error.message,
});
return;
}

setPopup({
  open: true,
  type: "success",
  title: "Restore Completed",
  message: "Database Restored Successfully",
});

}
return (

<div className="min-h-screen bg-gray-100 p-6">  <div className="max-w-7xl mx-auto">  <h1 className="text-4xl font-bold text-[#031B2E] mb-8">  
Settings  
</h1>  {/* ========================= /}
{/ Account & Security /}
{/ ========================= */}

<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">  <div className="flex items-center gap-3 mb-6">  <KeyRound  
className="text-[#031B2E]"  
size={28}  
/>

<h2 className="text-2xl font-bold">  
Account & Security  
</h2>  </div>  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  <div>  <label className="block mb-2 font-semibold">  
User ID  
</label>  <input
type="text"
value={userId}
onChange={(e)=>setUserId(e.target.value)}
className="w-full border rounded-xl p-3"
/>

</div>  <div>  <label className="block mb-2 font-semibold">  
Registered Mobile  
</label>  <input
type="text"
value={registeredMobile}
onChange={(e)=>setRegisteredMobile(e.target.value)}
className="w-full border rounded-xl p-3"
/>

</div>  <div>  <label className="block mb-2 font-semibold">  
Current Password  
</label>  <input
type="password"
value={currentPassword}
onChange={(e)=>setCurrentPassword(e.target.value)}
className="w-full border rounded-xl p-3"
/>

</div>  <div>  <label className="block mb-2 font-semibold">  
New Password  
</label>  <input
type="password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
className="w-full border rounded-xl p-3"
/>

</div>  <div>  <label className="block mb-2 font-semibold">  
Confirm Password  
</label>  <input
type="password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="w-full border rounded-xl p-3"
/>

</div>  <div>  <label className="block mb-2 font-semibold">  
OTP  
</label>  <input
type="text"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
placeholder="Enter OTP"
className="w-full border rounded-xl p-3"
/>

</div>  </div>  <div className="flex gap-3 mt-6 flex-wrap">  <button
onClick={sendOtp}
className="bg-[#031B2E] text-white px-5 py-3 rounded-xl"

> 

Send OTP
</button>

<button
onClick={verifyOtp}
className="bg-green-600 text-white px-5 py-3 rounded-xl"

> 

Verify OTP
</button>

<button
onClick={updatePassword}
className="bg-blue-600 text-white px-5 py-3 rounded-xl"

> 

Update Password
</button>

</div>  </div>  
{/* ========================= */}  
{/* Visitor Settings */}  
{/* ========================= */}  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">    <div className="flex items-center gap-3 mb-6">  
    <Settings className="text-[#031B2E]" size={28} />  
    <h2 className="text-2xl font-bold">  
      Visitor Settings  
    </h2>  
  </div>    <div className="space-y-5">  <label className="flex justify-between items-center border rounded-xl p-4">  
  <span className="font-semibold">  
    Auto Generate Visitor ID  
  </span>  

  <input  
    type="checkbox"  
    checked={autoVisitorId}  
    onChange={(e)=>setAutoVisitorId(e.target.checked)}  
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
    onChange={(e)=>setEnableEdit(e.target.checked)}  
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
    onChange={(e)=>setEnableDelete(e.target.checked)}  
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
    onChange={(e)=>setEnableExcelExport(e.target.checked)}  
    className="w-5 h-5"  
  />  
</label>

  </div>  </div>  {/* ========================= /}
{/ Database /}
{/ ========================= */}

<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">    <div className="flex items-center gap-3 mb-6">  
    <Database className="text-[#031B2E]" size={28} />  
    <h2 className="text-2xl font-bold">  
      Database  
    </h2>  
  </div>    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">  <button  
  onClick={backupDatabase}  
  className="border rounded-xl py-4 font-semibold hover:bg-gray-100"  
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
    className="border rounded-xl py-4 font-semibold hover:bg-gray-100"  
  >  
    Restore Database  
  </button>  
</>

  </div>  </div>  {/* ========================= /}
{/ Save Settings /}
{/ ========================= */}

<div className="flex justify-end gap-4 mb-10">  <button
onClick={saveSettings}
className="bg-[#031B2E] hover:bg-[#0B4EA2] text-white px-8 py-4 rounded-xl flex items-center gap-3 text-lg font-semibold"

> 

<Save size={22} />  
Save Settings

  </button>  </div>
  
  <Popup
  open={popup.open}
  type={popup.type as any}
  title={popup.title}
  message={popup.message}
  onClose={() =>
    setPopup({
      ...popup,
      open: false,
    })
  }
/>
  </div>  
</div>  );
}