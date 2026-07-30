"use client";

import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: string;
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "#0B4EA2",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon
            size={28}
            style={{ color }}
          />
        </div>
      </div>
    </div>
  );
}