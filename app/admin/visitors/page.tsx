"use client";

import Sidebar from "../../components/Sidebar";
import VisitorTable from "@/app/components/VisitorTable";

export default function VisitorsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 p-4 md:p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#031B2E]">
            Visitors
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 overflow-x-auto">
            <VisitorTable />
          </div>

        </div>

      </div>

    </div>
  );
}