"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "@/app/lib/supabase";

const COLORS = [
  "#0B4EA2",
  "#16A34A",
  "#F59E0B",
  "#DC2626",
  "#6B7280",
  "#9333EA",
  "#06B6D4",
  "#F97316",
];

export default function VisitorPieChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadChart = async () => {
      const { data: visitors, error } = await supabase
        .from("visitors")
        .select("visitor_type");

      if (!error && visitors) {
        const counts: any = {};

        visitors.forEach((v: any) => {
          const type = v.visitor_type || "Others";
          counts[type] = (counts[type] || 0) + 1;
        });

        const chartData = Object.keys(counts).map((key) => ({
          name: key,
          value: counts[key],
        }));

        setData(chartData);
      }
    };

    loadChart();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}