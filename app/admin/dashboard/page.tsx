"use client";

import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";
import StatsCard from "../../components/StatsCard";
import VisitorLineChart from "../../components/LineChart";
import VisitorPieChart from "../../components/PieChart";
import VisitorTable from "../../components/VisitorTable";

import {
Users,
Calendar,
TrendingUp,
UserCheck,
} from "lucide-react";

export default function DashboardPage() {
const [visitors, setVisitors] = useState<any[]>([]);
const [mounted, setMounted] = useState(false);
const [currentDate, setCurrentDate] = useState("");
const [currentTime, setCurrentTime] = useState("");

useEffect(() => {
setMounted(true);

const update = () => {  
  const now = new Date();  

  setCurrentDate(  
    now.toLocaleDateString("en-IN", {  
      weekday: "long",  
      day: "numeric",  
      month: "long",  
      year: "numeric",  
    })  
  );  

  setCurrentTime(now.toLocaleTimeString("en-IN"));  
};  

update();  
const loadVisitors = async () => {

const { data, error } = await supabase
.from("visitors")
.select("*")
.order("created_at", { ascending: false });

if (!error && data) {
setVisitors(data);
}
};

loadVisitors();
const timer = setInterval(update, 1000);

return () => clearInterval(timer);

}, []);

return (
<div className="min-h-screen bg-gray-100">

{/* Sidebar */}  

  {/* Main Content */}  
  <div className="flex-1 w-full overflow-x-hidden p-3 sm:p-4 lg:p-1">  

    {/* Header */}  
    {/* Header */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">  
  <div>  
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">  
      Dashboard  
    </h1>  
    <p className="text-sm sm:text-base text-gray-500 mt-1">  
      Welcome to RWD TOSTEM Visitor Management System  
    </p>  
  </div>    <div className="text-left md:text-right">  
  {mounted && (  
    <>  
      <p className="text-sm text-gray-500">  
        {currentDate}  
      </p>  <p className="text-xl font-semibold text-[#0B4EA2]">  
    {currentTime}  
  </p>  
</>

)}

</div>  
</div>  <div className="space-y-6">  

      {/* Stats */}  
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">  

        <StatsCard  
          title="Total Visitors"  
          value={visitors.length.toString()}  
          icon={Users}  
          color="#0B4EA2"  
        />  

        <StatsCard  
          title="Today's Visitors"  
          value={

visitors.filter(
(v) =>
new Date(v.created_at).toDateString() ===
new Date().toDateString()
).length.toString()
}
icon={Calendar}
color="#16A34A"
/>

<StatsCard  
          title="Monthly Visitors"  
          value={

visitors.filter(
(v) =>
new Date(v.created_at).getMonth() === new Date().getMonth() &&
new Date(v.created_at).getFullYear() === new Date().getFullYear()
).length.toString()
}
icon={TrendingUp}
color="#F59E0B"
/>

<StatsCard  
          title="Sales Executive"  
          value={

[
...new Set(
visitors
.filter((v) => v.sales_executive)
.map((v) => v.sales_executive)
),
].length.toString()
}
icon={UserCheck}
color="#9333EA"
/>

</div>  

      {/* Charts */}  

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">  

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 overflow-hidden">  
          <h2 className="text-xl font-bold mb-4">  
            Visitor Trend  
          </h2>  

          <VisitorLineChart />  
        </div>  

        <div className="bg-white rounded-2xl shadow p-6">  
          <h2 className="text-xl font-bold mb-4">  
            Visitor Type Distribution  
          </h2>  

          <VisitorPieChart />  
        </div>  

      </div>  

      {/* Visitor Table */}  

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 overflow-x-auto">  

        <h2 className="text-xl font-bold mb-4">  
          Recent Visitors  
        </h2>  

        <VisitorTable />  

      </div>  

    </div>  

  </div>  

</div>

);
}