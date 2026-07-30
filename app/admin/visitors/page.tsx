import VisitorTable from "@/app/components/VisitorTable";

export default function VisitorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">
        Visitors
      </h1>

      <VisitorTable />
    </div>
  );
}