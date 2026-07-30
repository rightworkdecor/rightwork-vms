"use client";

import { Search, Bell, UserCircle2 } from "lucide-react";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white h-20 border-b flex items-center justify-between px-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-5">

        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 h-11 w-72 border rounded-xl outline-none"
          />
        </div>

        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">
          <UserCircle2 size={40} className="text-[#0B4EA2]" />

          <div>
            <p className="font-semibold">
              Admin
            </p>

            <p className="text-sm text-gray-500">
              TOSTEM Experience Center
            </p>
          </div>
        </div>

      </div>

    </header>
  );
}