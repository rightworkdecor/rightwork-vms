"use client";

import Popup from "./Popup";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabase";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Shield,
  Download,
} from "lucide-react";

export default function VisitorTable() {

  // ==========================
  // LOADING
  // ==========================

  const [loading, setLoading] =
    useState(true);

  // ==========================
  // VISITORS
  // ==========================

  const [visitors, setVisitors] =
    useState<any[]>([]);

  const [selectedVisitor, setSelectedVisitor] =
    useState<any>(null);

  const [editVisitor, setEditVisitor] =
    useState<any>(null);

  // ==========================
  // SEARCH FILTERS
  // ==========================

  const [search, setSearch] =
    useState("");

  const [visitorTypeFilter, setVisitorTypeFilter] =
    useState("");

  const [branchFilter, setBranchFilter] =
    useState("");

  const [salesFilter, setSalesFilter] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  // ==========================
  // DROPDOWN DATA
  // ==========================

  const [branches, setBranches] =
    useState<string[]>([]);

  const [employees, setEmployees] =
    useState<string[]>([]);

  // ==========================
  // DELETE ACCESS
  // ==========================

  const [deleteEnabled, setDeleteEnabled] =
    useState(false);

  const [showOtpPopup, setShowOtpPopup] =
    useState(false);

  const [otp, setOtp] =
    useState("");

    const [popup, setPopup] = useState({
  open: false,
  type: "success",
  title: "",
  message: "",
});

const [showDeletePopup, setShowDeletePopup] = useState(false);
const [deleteId, setDeleteId] = useState<number | null>(null);

  // ==========================
  // PAGE LOAD
  // ==========================

  useEffect(() => {
    loadVisitors();
  }, []);
  // ==========================
// LOAD VISITORS
// ==========================

async function loadVisitors() {

  setLoading(true);

  const { data, error } = await supabase
    .from("visitors")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error.message);
    setLoading(false);
    return;
  }

  const visitorData = data || [];

  setVisitors(visitorData);

  // ==========================
  
// Branch List
const { data: branchData, error: branchError } = await supabase
  .from("branches")
  .select("*");

if (branchError) {
  setPopup({
  open: true,
  type: "error",
  title: "Branch Error",
  message: branchError.message,
});
} else {
  const branchList = branchData.map((b) => b.branch_name);
  setBranches(branchList);
}

// Employee List
const { data: employeeData, error: employeeError } = await supabase
  .from("sales_executives")
  .select("*");

if (employeeError) {
  setPopup({
  open: true,
  type: "error",
  title: "Employee Error",
  message: employeeError.message,
});
} else {
  const employeeList = employeeData.map((e) => e.employee_name);
  setEmployees(employeeList);
}

setLoading(false);

}
// ==========================
// UPDATE VISITOR
// ==========================

async function updateVisitor() {

  if (!editVisitor) return;

  const { error } = await supabase
    .from("visitors")
    .update({

      visitor_name: editVisitor.visitor_name,

      mobile: editVisitor.mobile,

      city: editVisitor.city,

      company_name: editVisitor.company_name,

      branch: editVisitor.branch,

      visitor_type: editVisitor.visitor_type,

      project_type: editVisitor.project_type,

      project_location:
        editVisitor.project_location,

      sales_executive:
        editVisitor.sales_executive,

      remarks: editVisitor.remarks,

    })
    .eq("id", editVisitor.id);

  if (error) {
  setPopup({
    open: true,
    type: "error",
    title: "Update Failed",
    message: error.message,
  });
  return;
}

  setPopup({
  open: true,
  type: "success",
  title: "Success",
  message: "Visitor Updated Successfully",
});

  setEditVisitor(null);

  loadVisitors();
}
// ==========================
// DELETE VISITOR
// ==========================

async function deleteVisitor(id: number) {

  if (!deleteEnabled) {
    setPopup({
      open: true,
      type: "warning",
      title: "Permission Denied",
      message: "Delete Permission Disabled",
    });
    return;
  }

  setDeleteId(id);
  setShowDeletePopup(true);
}

  async function confirmDelete() {

  if (!deleteId) return;

  const { error } = await supabase
    .from("visitors")
    .delete()
    .eq("id", deleteId);

  if (error) {
    setPopup({
      open: true,
      type: "error",
      title: "Delete Failed",
      message: error.message,
    });
    return;
  }

  setShowDeletePopup(false);
  setDeleteId(null);

  setPopup({
    open: true,
    type: "success",
    title: "Deleted",
    message: "Visitor Deleted Successfully",
  });

  loadVisitors();
}
// ==========================
// VERIFY OTP
// ==========================

function verifyOtp() {

  if (otp !== "123456") {
    setPopup({
  open: true,
  type: "error",
  title: "Invalid OTP",
  message: "Please enter correct OTP.",
});
    return;
  }

  setDeleteEnabled(true);

  setShowOtpPopup(false);

  setOtp("");

  setPopup({
  open: true,
  type: "success",
  title: "Access Granted",
  message: "Delete Access Enabled for 10 Minutes",
});

  setTimeout(() => {
    setDeleteEnabled(false);
  }, 10 * 60 * 1000);
}

// ==========================
// EXPORT EXCEL
// ==========================

function exportExcel() {

  const exportData = filteredVisitors.map((visitor) => ({

    "Visitor ID": visitor.visitor_id,
    "Visitor Name": visitor.visitor_name,
    Mobile: visitor.mobile,
    City: visitor.city,
    Company: visitor.company_name,
    Branch: visitor.branch,
    "Visitor Type": visitor.visitor_type,
    "Project Type": visitor.project_type,
    "Project Location": visitor.project_location,
    "Sales Executive": visitor.sales_executive,
    Remarks: visitor.remarks,

    Date: new Date(
      visitor.created_at
    ).toLocaleString("en-IN"),

  }));

  const worksheet =
    XLSX.utils.json_to_sheet(exportData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Visitors"
  );

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array",
    }
  );

  saveAs(
    new Blob([excelBuffer]),
    "Visitors.xlsx"
  );
  setPopup({
  open: true,
  type: "success",
  title: "Export Complete",
  message: "Visitors exported successfully.",
});
}
// ==========================
// FILTERED VISITORS
// ==========================

const filteredVisitors = useMemo(() => {

  return visitors.filter((visitor) => {

    const keyword = search
      .trim()
      .toLowerCase();

    const visitorDate = visitor.created_at
      ? visitor.created_at.substring(0, 10)
      : "";

    // ==========================
    // GLOBAL SEARCH
    // ==========================

    const searchMatch =

      (visitor.visitor_id || "")
        .toLowerCase()
        .includes(keyword)

      ||

      (visitor.visitor_name || "")
        .toLowerCase()
        .includes(keyword)

      ||

      (visitor.mobile || "")
        .toLowerCase()
        .includes(keyword)

      ||

      (visitor.city || "")
        .toLowerCase()
        .includes(keyword)

      ||

      (visitor.company_name || "")
        .toLowerCase()
        .includes(keyword)

      ||

      (visitor.branch || "")
        .toLowerCase()
        .includes(keyword)

      ||

      (visitor.sales_executive || "")
        .toLowerCase()
        .includes(keyword)

      ||

      (visitor.project_type || "")
        .toLowerCase()
        .includes(keyword);

    // ==========================
    // VISITOR TYPE FILTER
    // ==========================

    const visitorTypeMatch =
      visitorTypeFilter === "" ||
      visitor.visitor_type ===
        visitorTypeFilter;

    // ==========================
    // BRANCH FILTER
    // ==========================

    const branchMatch =
      branchFilter === "" ||
      visitor.branch === branchFilter;

    // ==========================
    // EMPLOYEE FILTER
    // ==========================

    const salesMatch =
      salesFilter === "" ||
      visitor.sales_executive ===
        salesFilter;

    // ==========================
    // DATE FILTER
    // ==========================

    const dateMatch =
      (!fromDate ||
        visitorDate >= fromDate) &&
      (!toDate ||
        visitorDate <= toDate);

    return (
      searchMatch &&
      visitorTypeMatch &&
      branchMatch &&
      salesMatch &&
      dateMatch
    );

  });

}, [
  visitors,
  search,
  visitorTypeFilter,
  branchFilter,
  salesFilter,
  fromDate,
  toDate,
]);
useEffect(() => {
  console.log("Popup Open:", popup.open);
}, [popup.open]);

// ==========================
// RETURN
// ==========================

return (
  <>
  <div className="bg-white rounded-2xl shadow w-full overflow-hidden">

  {/* ==========================
      HEADER
  ========================== */}

  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 p-6 border-b">

    <div className="flex flex-wrap items-center gap-3">

      <button
        onClick={() => setShowOtpPopup(true)}
        className="flex items-center gap-2 bg-[#031B2E] hover:bg-[#0B4EA2] text-white px-5 py-3 rounded-xl transition"
      >
        <Shield size={18} />
        Delete Access
      </button>

      {deleteEnabled && (
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
          ✅ Delete Enabled
        </span>
      )}

    </div>

    <button
      onClick={exportExcel}
      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition"
    >
      <Download size={18} />
      Export Excel
    </button>

  </div>

  {/* ==========================
      SEARCH & FILTERS
  ========================== */}

  <div className="p-6 border-b">

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

      {/* Search */}

      <div className="relative xl:col-span-2">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
  type="search"
  placeholder="Search Visitor..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  autoComplete="off"
  autoCorrect="off"
  autoCapitalize="off"
  spellCheck={false}
  name="visitor-search"
  className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4EA2]"
/>

      </div>

      {/* Visitor Type */}

      <select
        value={visitorTypeFilter}
        onChange={(e) =>
          setVisitorTypeFilter(e.target.value)
        }
        className="border rounded-xl px-3 py-3"
      >
        <option value="">All Visitor Types</option>

<option value="End Customer">End Customer</option>
<option value="Architect">Architect</option>
<option value="Builder">Builder</option>
<option value="Engineer">Engineer</option>
<option value="Interior Designer">Interior Designer</option>
<option value="Contractor">Contractor</option>
<option value="Dealer">Dealer</option>
<option value="Vendor">Vendor</option>
<option value="Other">Other</option>

      </select>

      {/* Branch */}

      <select
        value={branchFilter}
        onChange={(e) =>
          setBranchFilter(e.target.value)
        }
        className="border rounded-xl px-3 py-3"
      >

        <option value="">
          All Branches
        </option>

        {branches.map((branch) => (

          <option
            key={branch}
            value={branch}
          >
            {branch}
          </option>

        ))}

      </select>

      {/* Sales Executive */}

      <select
        value={salesFilter}
        onChange={(e) =>
          setSalesFilter(e.target.value)
        }
        className="border rounded-xl px-3 py-3"
      >

        <option value="">
          All Employees
        </option>

        {employees.map((employee) => (

          <option
            key={employee}
            value={employee}
          >
            {employee}
          </option>

        ))}

      </select>

      {/* From Date */}

      <input
        type="date"
        value={fromDate}
        onChange={(e) =>
          setFromDate(e.target.value)
        }
        className="border rounded-xl px-3 py-3"
      />

      {/* To Date */}

      <input
        type="date"
        value={toDate}
        onChange={(e) =>
          setToDate(e.target.value)
        }
        className="border rounded-xl px-3 py-3"
      />

    </div>

  </div>
  {/* ==========================
      DESKTOP TABLE
========================== */}

<div className="hidden lg:block w-full overflow-x-auto">

  <table className="min-w-[1300px] w-full table-auto">

    <thead className="bg-[#031B2E] text-white">

      <tr>

        <th className="px-4 py-4 text-left whitespace-nowrap">
          Visitor ID
        </th>

        <th className="px-4 py-4 text-left whitespace-nowrap">
          Visitor Name
        </th>

        <th className="px-4 py-4 text-left whitespace-nowrap">
          Mobile
        </th>

        <th className="px-4 py-4 text-left whitespace-nowrap">
          City
        </th>

        <th className="px-4 py-4 text-left whitespace-nowrap">
          Branch
        </th>

        <th className="px-4 py-4 text-left whitespace-nowrap">
          Project Type
        </th>

        <th className="px-4 py-4 text-left whitespace-nowrap">
          Sales Executive
        </th>

        <th className="w-40 px-4 py-4 text-center whitespace-nowrap">
  Actions
</th>

      </tr>

    </thead>

    <tbody>

      {loading ? (

        <tr>

          <td
            colSpan={8}
            className="text-center py-16 text-gray-500"
          >
            Loading Visitors...
          </td>

        </tr>

      ) : filteredVisitors.length === 0 ? (

        <tr>

          <td
            colSpan={8}
            className="text-center py-16 text-gray-500"
          >
            No Visitors Found
          </td>

        </tr>

      ) : (

        filteredVisitors.map((visitor) => (

          <tr
            key={visitor.id}
            className="border-b hover:bg-blue-50 transition"
          >

            <td className="px-4 py-4 font-semibold">
              {visitor.visitor_id}
            </td>

            <td className="px-4 py-4 max-w-[180px] truncate">
  {visitor.visitor_name}
</td>

            <td className="w-40 px-4 py-4">
              {visitor.mobile}
            </td>

            <td className="w-40 px-4 py-4">
              {visitor.city}
            </td>

            <td className="w-40 px-4 py-4">
  {visitor.branch}
</td>

            <td className="w-40 px-4 py-4">
              {visitor.project_type}
            </td>

            <td className="w-40 px-4 py-4">
              {visitor.sales_executive}
            </td>

            <td className="w-40 px-4 py-4">

              <div className="flex items-center justify-center gap-2 whitespace-nowrap">

                {/* View */}

                <button
                  onClick={() =>
                    setSelectedVisitor(visitor)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg"
                >
                  <Eye size={18} />
                </button>

                {/* Edit */}

                <button
                  onClick={() =>
                    setEditVisitor({
                      ...visitor,
                    })
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition"
                >
                  <Pencil size={18} />
                </button>

                {/* Delete */}

                <button
                  disabled={!deleteEnabled}
                  onClick={() =>
                    deleteVisitor(visitor.id)
                  }
                  className={`p-2 rounded-lg transition ${
                    deleteEnabled
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>
{/* ==========================
      MOBILE & TABLET CARDS
========================== */}

<div className="lg:hidden p-4 space-y-4">

  {loading ? (

    <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
      Loading Visitors...
    </div>

  ) : filteredVisitors.length === 0 ? (

    <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
      No Visitors Found
    </div>

  ) : (

    filteredVisitors.map((visitor) => (

      <div
        key={visitor.id}
        className="bg-white border rounded-2xl shadow-md p-5"
      >

        {/* Header */}

        <div className="flex justify-between items-start gap-3">

          <div className="flex-1">

            <h3 className="text-lg font-bold text-[#031B2E]">
              {visitor.visitor_name}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {visitor.visitor_id}
            </p>

          </div>

          <span className="text-gray-700 font-medium">
  {visitor.branch}
</span>
        </div>

        {/* Details */}

        <div className="mt-5 space-y-3 text-sm">

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">
              Mobile
            </span>

            <span className="font-semibold">
              {visitor.mobile}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">
              City
            </span>

            <span className="font-semibold">
              {visitor.city}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">
              Project
            </span>

            <span className="font-semibold">
              {visitor.project_type}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">
              Sales Executive
            </span>

            <span className="font-semibold">
              {visitor.sales_executive}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">
              Date
            </span>

            <span className="font-semibold">
              {new Date(
                visitor.created_at
              ).toLocaleDateString("en-IN")}
            </span>
          </div>

        </div>

        {/* Action Buttons */}

        <div className="grid grid-cols-3 gap-3 mt-6">

          <button
            onClick={() => setSelectedVisitor(visitor)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
          >
            <Eye size={18} className="mx-auto" />
          </button>

          <button
            onClick={() =>
              setEditVisitor({
                ...visitor,
              })
            }
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl transition"
          >
            <Pencil size={18} className="mx-auto" />
          </button>

          <button
            disabled={!deleteEnabled}
            onClick={() => deleteVisitor(visitor.id)}
            className={`py-3 rounded-xl transition ${
              deleteEnabled
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Trash2 size={18} className="mx-auto" />
          </button>

        </div>

      </div>

    ))

  )}

</div>
{/* ==========================
      DELETE ACCESS OTP POPUP
========================== */}

{showOtpPopup && (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-[#031B2E] to-[#0B4EA2] px-6 py-6">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">

            <Shield size={28} className="text-white" />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">
              Delete Access
            </h2>

            <p className="text-blue-100 text-sm mt-1">
              Administrator Permission Required
            </p>

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="p-6 space-y-5">

        <div>

          <label className="block text-sm font-semibold mb-2">
            Enter OTP
          </label>

          <input
  type="password"
  inputMode="numeric"
  autoComplete="one-time-code"
  autoCorrect="off"
  autoCapitalize="off"
  spellCheck={false}
  name="otp-code"
  value={otp}
  onChange={(e) => setOtp(e.target.value)}
  placeholder="Enter 6 Digit OTP"
  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#0B4EA2]"
/>

        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">

          <h4 className="font-semibold text-blue-900">
            Security Notice
          </h4>

          <p className="text-sm text-blue-700 mt-2">
            After successful verification,
            <span className="font-bold">
              {" "}Delete Permission{" "}
            </span>
            will remain active for
            <span className="font-bold">
              {" "}10 Minutes.
            </span>
          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="border-t bg-gray-50 p-5 flex flex-col sm:flex-row justify-end gap-3">

        <button
          onClick={() => {
            setShowOtpPopup(false);
            setOtp("");
          }}
          className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition"
        >
          Cancel
        </button>

        <button
          onClick={verifyOtp}
          className="w-full sm:w-auto bg-[#031B2E] hover:bg-[#0B4EA2] text-white px-6 py-3 rounded-xl transition"
        >
          Verify OTP
        </button>

      </div>

    </div>

  </div>
)}
{/* ==========================
      VIEW VISITOR POPUP
========================== */}

{selectedVisitor && (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">

      {/* Header */}

      <div className="bg-gradient-to-r from-[#031B2E] to-[#0B4EA2] px-6 py-5 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Visitor Details
          </h2>

          <p className="text-blue-100 mt-1">
            Complete Visitor Information
          </p>

        </div>

        <button
          onClick={() => setSelectedVisitor(null)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition"
        >
          Close
        </button>

      </div>

      {/* Body */}

      <div className="p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* Visitor ID */}

          <div className="bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              Visitor ID
            </p>

            <h3 className="text-xl font-bold mt-2">
              {selectedVisitor.visitor_id}
            </h3>
          </div>

          {/* Visitor Name */}

          <div className="bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              Visitor Name
            </p>

            <h3 className="text-xl font-bold mt-2">
              {selectedVisitor.visitor_name}
            </h3>
          </div>

          {/* Mobile */}

          <div className="bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              Mobile Number
            </p>

            <h3 className="text-xl font-bold mt-2">
              {selectedVisitor.mobile}
            </h3>
          </div>

          {/* City */}

          <div className="bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              City
            </p>

            <h3 className="text-xl font-bold mt-2">
              {selectedVisitor.city}
            </h3>
          </div>

          {/* Company */}

          <div className="bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              Company Name
            </p>

            <h3 className="text-xl font-bold mt-2">
              {selectedVisitor.company_name || "-"}
            </h3>
          </div>

          {/* Branch */}

          <div className="bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              Branch
            </p>

            <h3 className="text-xl font-bold mt-2">
              {selectedVisitor.branch}
            </h3>
          </div>

          {/* Visitor Type */}

          <div className="bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              Visitor Type
            </p>

            <h3 className="text-xl font-bold mt-2">
              {selectedVisitor.visitor_type}
            </h3>
          </div>

          {/* Project Type */}

          <div className="bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              Project Type
            </p>

            <h3 className="text-xl font-bold mt-2">
              {selectedVisitor.project_type}
            </h3>
          </div>

          {/* Sales Executive */}

          <div className="bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              Sales Executive
            </p>

            <h3 className="text-xl font-bold mt-2">
              {selectedVisitor.sales_executive}
            </h3>
          </div>

          {/* Project Location */}

          <div className="md:col-span-2 xl:col-span-3 bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              Project Location
            </p>

            <h3 className="text-lg font-semibold mt-2">
              {selectedVisitor.project_location || "-"}
            </h3>
          </div>

          {/* Remarks */}

          <div className="md:col-span-2 xl:col-span-3 bg-gray-50 border rounded-2xl p-5">
            <p className="text-xs uppercase text-gray-500">
              Remarks
            </p>

            <p className="text-lg mt-2 leading-8">
              {selectedVisitor.remarks || "No Remarks"}
            </p>
          </div>

          {/* Visit Date */}

          <div className="md:col-span-2 xl:col-span-3 bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <p className="text-xs uppercase text-blue-700">
              Visit Date & Time
            </p>

            <h3 className="text-xl font-bold text-[#031B2E] mt-2">
              {new Date(
                selectedVisitor.created_at
              ).toLocaleString("en-IN")}
            </h3>
          </div>

        </div>

      </div>

    </div>

  </div>
)}
{/* ==========================
      EDIT VISITOR POPUP
========================== */}

{editVisitor && (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">

      {/* Header */}

      <div className="bg-gradient-to-r from-[#031B2E] to-[#0B4EA2] px-6 py-5 flex justify-between items-center">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Edit Visitor
          </h2>

          <p className="text-blue-100 mt-1">
            Update Visitor Information
          </p>

        </div>

        <button
          onClick={() => setEditVisitor(null)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
        >
          Close
        </button>

      </div>

      {/* Body */}

      <div className="p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Visitor Name */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Visitor Name
            </label>

            <input
              type="text"
              value={editVisitor.visitor_name || ""}
              onChange={(e)=>
                setEditVisitor({
                  ...editVisitor,
                  visitor_name:e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

          {/* Mobile */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Mobile Number
            </label>

            <input
              type="text"
              value={editVisitor.mobile || ""}
              onChange={(e)=>
                setEditVisitor({
                  ...editVisitor,
                  mobile:e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

          {/* City */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              City
            </label>

            <input
              type="text"
              value={editVisitor.city || ""}
              onChange={(e)=>
                setEditVisitor({
                  ...editVisitor,
                  city:e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

          {/* Company */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Company Name
            </label>

            <input
              type="text"
              value={editVisitor.company_name || ""}
              onChange={(e)=>
                setEditVisitor({
                  ...editVisitor,
                  company_name:e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

          {/* Branch */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Branch
            </label>

            <select
              value={editVisitor.branch || ""}
              onChange={(e)=>
                setEditVisitor({
                  ...editVisitor,
                  branch:e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            >

              <option value="">
                Select Branch
              </option>

              {branches.map((branch)=>(
                <option
                  key={branch}
                  value={branch}
                >
                  {branch}
                </option>
              ))}

            </select>

          </div>

          {/* Visitor Type */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Visitor Type
            </label>

            <select
  value={editVisitor.visitor_type || ""}
  onChange={(e) =>
    setEditVisitor({
      ...editVisitor,
      visitor_type: e.target.value,
    })
  }
  className="w-full border rounded-xl p-3"
>
  <option value="">Select Visitor Type</option>

  <option value="End Customer">End Customer</option>
  <option value="Architect">Architect</option>
  <option value="Builder">Builder</option>
  <option value="Engineer">Engineer</option>
  <option value="Interior Designer">Interior Designer</option>
  <option value="Contractor">Contractor</option>
  <option value="Dealer">Dealer</option>
  <option value="Vendor">Vendor</option>
  <option value="Other">Other</option>
</select>

          </div>

          {/* Project Type */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Project Type
            </label>

            <input
              type="text"
              value={editVisitor.project_type || ""}
              onChange={(e)=>
                setEditVisitor({
                  ...editVisitor,
                  project_type:e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

          {/* Sales Executive */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Sales Executive
            </label>

            <select
              value={editVisitor.sales_executive || ""}
              onChange={(e)=>
                setEditVisitor({
                  ...editVisitor,
                  sales_executive:e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            >

              <option value="">
                Select Employee
              </option>

              {employees.map((emp)=>(
                <option
                  key={emp}
                  value={emp}
                >
                  {emp}
                </option>
              ))}

            </select>

          </div>

          {/* Project Location */}

          <div className="md:col-span-2">

            <label className="block text-sm font-semibold mb-2">
              Project Location
            </label>

            <input
              type="text"
              value={editVisitor.project_location || ""}
              onChange={(e)=>
                setEditVisitor({
                  ...editVisitor,
                  project_location:e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

          {/* Remarks */}

          <div className="md:col-span-2">

            <label className="block text-sm font-semibold mb-2">
              Remarks
            </label>

            <textarea
              rows={5}
              value={editVisitor.remarks || ""}
              onChange={(e)=>
                setEditVisitor({
                  ...editVisitor,
                  remarks:e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="sticky bottom-0 bg-white border-t px-6 py-5 flex flex-col sm:flex-row justify-end gap-3">

        <button
          onClick={() => setEditVisitor(null)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={updateVisitor}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Update Visitor
        </button>

      </div>

    </div>

  </div>
)}

</div>
{showDeletePopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="bg-white rounded-2xl p-6 w-[400px]">

      <h2 className="text-2xl font-bold mb-3">
        Delete Visitor
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this visitor?
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setShowDeletePopup(false)}
          className="px-5 py-2 bg-gray-400 text-white rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="px-5 py-2 bg-red-600 text-white rounded-xl"
        >
          Delete
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
    setPopup((prev) => ({
      ...prev,
      open: false,
    }))
  }
/>

</>
);

}