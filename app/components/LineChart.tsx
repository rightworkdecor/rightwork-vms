"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function VisitorLineChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadChart = async () => {
      const { data: visitors, error } = await supabase
        .from("visitors")
        .select("created_at");

      if (error) return;

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const counts: Record<string, number> = {
  Sun: 0,
  Mon: 0,
  Tue: 0,
  Wed: 0,
  Thu: 0,
  Fri: 0,
  Sat: 0,
};
      visitors?.forEach((v) => {
  const day = days[new Date(v.created_at).getDay()];

  if (counts[day] !== undefined) {
    counts[day]++;
  }
});

      setData([
        { day: "Mon", visitors: counts.Mon },
        { day: "Tue", visitors: counts.Tue },
        { day: "Wed", visitors: counts.Wed },
        { day: "Thu", visitors: counts.Thu },
        { day: "Fri", visitors: counts.Fri },
        { day: "Sat", visitors: counts.Sat },
        { day: "Sun", visitors: counts.Sun },
      ]);
    };

    loadChart();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="visitors"
          stroke="#0B4EA2"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}