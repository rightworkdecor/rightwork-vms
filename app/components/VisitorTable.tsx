"use client";

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
  const [visitors, setVisitors] = useState<any[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
  const [editVisitor, setEditVisitor] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [visitorTypeFilter, setVisitorTypeFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [salesFilter, setSalesFilter] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    loadVisitors();
  }, []);

  async function loadVisitors() {
    const { data, error } = await supabase
      .from("visitors")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setVisitors(data);
    }
  }

  async function updateVisitor() {
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
        project_location: editVisitor.project_location,
        sales_executive: editVisitor.sales_executive,
        remarks: editVisitor.remarks,
      })
      .eq("id", editVisitor.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Visitor Updated Successfully");
    setEditVisitor(null);
    loadVisitors();
  }

  async function deleteVisitor(id: number) {
    if (!deleteEnabled) {
      alert("Delete permission disabled.");
      return;
    }

    if (!confirm("Delete this visitor?")) return;

    const { error } = await supabase
      .from("visitors")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadVisitors();
  }

  function verifyOtp() {
    if (otp === "123456") {
      setDeleteEnabled(true);
      setShowOtpPopup(false);

      alert("Delete Enabled for 10 Minutes");

      setTimeout(() => {
        setDeleteEnabled(false);
      }, 600000);
    } else {
      alert("Invalid OTP");
    }
  }

  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const text = search.toLowerCase();

      const visitorDate = new Date(v.created_at)
        .toISOString()
        .split("T")[0];

      const matchSearch =
        (v.visitor_id || "").toLowerCase().includes(text) ||
        (v.visitor_name || "").toLowerCase().includes(text) ||
        (v.mobile || "").includes(text) ||
        (v.city || "").toLowerCase().includes(text);

      const matchType =
        visitorTypeFilter === "" ||
        v.visitor_type === visitorTypeFilter;

      const matchBranch =
        branchFilter === "" ||
        v.branch === branchFilter;

      const matchSales =
        salesFilter === "" ||
        v.sales_executive === salesFilter;

      const matchDate =
        (!fromDate || visitorDate >= fromDate) &&
        (!toDate || visitorDate <= toDate);

      return (
        matchSearch &&
        matchType &&
        matchBranch &&
        matchSales &&
        matchDate
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
  function exportExcel() {
    const data = filteredVisitors.map((v) => ({
      "Visitor ID": v.visitor_id,
      Name: v.visitor_name,
      Mobile: v.mobile,
      City: v.city,
      Branch: v.branch,
      Company: v.company_name,
      "Visitor Type": v.visitor_type,
      "Project Type": v.project_type,
      "Sales Executive": v.sales_executive,
      Date: new Date(v.created_at).toLocaleString("en-IN"),
    }));

    const sheet = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      sheet,
      "Visitors"
    );

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer]),
      "Visitors.xlsx"
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow">

        {/* Header */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 border-b">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setShowOtpPopup(true)}
              className="flex items-center gap-2 bg-[#031B2E] hover:bg-[#0B4EA2] text-white px-5 py-3 rounded-xl"
            >
              <Shield size={18} />
              Delete Access
            </button>

            {deleteEnabled && (
              <span className="text-green-600 font-semibold">
                Delete Enabled
              </span>
            )}

          </div>

          <button
            onClick={exportExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
          >
            <Download size={18} />
            Export Excel
          </button>

        </div>

        {/* Filters */}

        {/* Yahan tumhare filters waise hi rahenge, koi change nahi */}

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-[#031B2E] text-white">

              <tr className="text-base">

                <th className="px-4 py-4 text-left">Visitor ID</th>
                <th className="px-4 py-4 text-left">Name</th>
                <th className="px-4 py-4 text-left">Mobile</th>
                <th className="px-4 py-4 text-left">City</th>
                <th className="px-4 py-4 text-left">Branch</th>
                <th className="px-4 py-4 text-left">Project Type</th>
                <th className="px-4 py-4 text-left">Sales Executive</th>
                <th className="px-4 py-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredVisitors.map((visitor) => (

                <tr
                  key={visitor.id}
                  className="border-b hover:bg-gray-50 text-base"
                >

                  <td className="px-4 py-4">
                    {visitor.visitor_id}
                  </td>

                  <td className="px-4 py-4 font-medium">
                    {visitor.visitor_name}
                  </td>

                  <td className="px-4 py-4">
                    {visitor.mobile}
                  </td>

                  <td className="px-4 py-4">
                    {visitor.city}
                  </td>

                  <td className="px-4 py-4">
                    {visitor.branch}
                  </td>

                  <td className="px-4 py-4">
                    {visitor.project_type}
                  </td>

                  <td className="px-4 py-4">
                    {visitor.sales_executive}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setSelectedVisitor(visitor)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => setEditVisitor({ ...visitor })}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        disabled={!deleteEnabled}
                        onClick={() => deleteVisitor(visitor.id)}
                        className={`p-2 rounded-lg ${
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OTP Popup */}
      {/* OTP Popup ka code wahi rakho jo tumhare original file me hai */}

      {/* View Popup */}

      {selectedVisitor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-8">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Visitor Details</h2>

              <button
                onClick={() => setSelectedVisitor(null)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5 text-lg">

              <p><b>Visitor ID :</b> {selectedVisitor.visitor_id}</p>

              <p><b>Name :</b> {selectedVisitor.visitor_name}</p>

              <p><b>Mobile :</b> {selectedVisitor.mobile}</p>

              <p><b>City :</b> {selectedVisitor.city}</p>

              <p><b>Visitor Type :</b> {selectedVisitor.visitor_type}</p>

              <p><b>Company :</b> {selectedVisitor.company_name || "-"}</p>

              <p><b>Branch :</b> {selectedVisitor.branch}</p>

              <p><b>Project Type :</b> {selectedVisitor.project_type}</p>

              <p className="col-span-2">
                <b>Project Location :</b> {selectedVisitor.project_location || "-"}
              </p>

              <p><b>Sales Executive :</b> {selectedVisitor.sales_executive}</p>

              <p>
                <b>Date :</b>{" "}
                {new Date(selectedVisitor.created_at).toLocaleString("en-IN")}
              </p>

              <p className="col-span-2">
                <b>Remarks :</b> {selectedVisitor.remarks || "-"}
              </p>

            </div>
          </div>
        </div>
      )}

      {/* Edit Popup */}

      {editVisitor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">

            <h2 className="text-3xl font-bold mb-6">
              Edit Visitor
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                className="border rounded-lg p-3 text-lg"
                value={editVisitor.visitor_name || ""}
                onChange={(e) =>
                  setEditVisitor({
                    ...editVisitor,
                    visitor_name: e.target.value,
                  })
                }
              />

              <input
                className="border rounded-lg p-3"
                value={editVisitor.mobile || ""}
                onChange={(e) =>
                  setEditVisitor({
                    ...editVisitor,
                    mobile: e.target.value,
                  })
                }
              />

              <input
                className="border rounded-lg p-3"
                value={editVisitor.city || ""}
                onChange={(e) =>
                  setEditVisitor({
                    ...editVisitor,
                    city: e.target.value,
                  })
                }
              />

              <input
                className="border rounded-lg p-3"
                value={editVisitor.company_name || ""}
                onChange={(e) =>
                  setEditVisitor({
                    ...editVisitor,
                    company_name: e.target.value,
                  })
                }
              />

              <input
                className="border rounded-lg p-3"
                value={editVisitor.branch || ""}
                onChange={(e) =>
                  setEditVisitor({
                    ...editVisitor,
                    branch: e.target.value,
                  })
                }
              />

              <input
                className="border rounded-lg p-3"
                value={editVisitor.project_type || ""}
                onChange={(e) =>
                  setEditVisitor({
                    ...editVisitor,
                    project_type: e.target.value,
                  })
                }
              />

              <input
                className="border rounded-lg p-3"
                value={editVisitor.sales_executive || ""}
                onChange={(e) =>
                  setEditVisitor({
                    ...editVisitor,
                    sales_executive: e.target.value,
                  })
                }
              />

              <input
                className="border rounded-lg p-3 col-span-2"
                value={editVisitor.project_location || ""}
                onChange={(e) =>
                  setEditVisitor({
                    ...editVisitor,
                    project_location: e.target.value,
                  })
                }
              />

              <textarea
                rows={3}
                className="border rounded-lg p-3 col-span-2"
                value={editVisitor.remarks || ""}
                onChange={(e) =>
                  setEditVisitor({
                    ...editVisitor,
                    remarks: e.target.value,
                  })
                }
              />

            </div>

            <div className="sticky bottom-0 bg-white pt-4 flex justify-end gap-4">

              <button
                onClick={() => setEditVisitor(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={updateVisitor}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                Update Visitor
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}