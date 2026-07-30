"use client";

import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

import {
  Building2,
  Compass,
  Ellipsis,
  Handshake,
  HardHat,
  Sofa,
  Store,
  Users,
  UserRound,
  User,
  Phone,
  MapPin,
  Map,
  Wrench,
  UserCheck,
  FileText,
} from "lucide-react";

export default function VisitorPage() {

  const cityOptions = [
    { value: "Bengaluru", label: "Bengaluru" },
    { value: "Mysuru", label: "Mysuru" },
    { value: "Hubballi", label: "Hubballi" },
    { value: "Dharwad", label: "Dharwad" },
    { value: "Mangaluru", label: "Mangaluru" },
    { value: "Belagavi", label: "Belagavi" },
    { value: "Shivamogga", label: "Shivamogga" },
    { value: "Kalaburagi", label: "Kalaburagi" },
    { value: "Ballari", label: "Ballari" },
    { value: "Davanagere", label: "Davanagere" },

    { value: "Chennai", label: "Chennai" },
    { value: "Coimbatore", label: "Coimbatore" },
    { value: "Madurai", label: "Madurai" },
    { value: "Salem", label: "Salem" },
    { value: "Tiruchirappalli", label: "Tiruchirappalli" },
    { value: "Tiruppur", label: "Tiruppur" },
    { value: "Vellore", label: "Vellore" },
    { value: "Erode", label: "Erode" },

    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Warangal", label: "Warangal" },
    { value: "Karimnagar", label: "Karimnagar" },
    { value: "Nizamabad", label: "Nizamabad" },
    { value: "Khammam", label: "Khammam" },

    { value: "Visakhapatnam", label: "Visakhapatnam" },
    { value: "Vijayawada", label: "Vijayawada" },
    { value: "Guntur", label: "Guntur" },
    { value: "Tirupati", label: "Tirupati" },
    { value: "Kurnool", label: "Kurnool" },
    { value: "Rajahmundry", label: "Rajahmundry" },
    { value: "Nellore", label: "Nellore" },

    { value: "Kochi", label: "Kochi" },
    { value: "Thiruvananthapuram", label: "Thiruvananthapuram" },
    { value: "Kozhikode", label: "Kozhikode" },
    { value: "Thrissur", label: "Thrissur" },
    { value: "Kannur", label: "Kannur" },
    { value: "Kollam", label: "Kollam" },
    { value: "Alappuzha", label: "Alappuzha" },
  ];

  const [now, setNow] = useState<Date | null>(null);

  const [projectType, setProjectType] = useState("");
  const [branch, setBranch] = useState("");
  const [visitorType, setVisitorType] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [mobile, setMobile] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState<{ value: string; label: string } | null>(null);
  const [projectLocation, setProjectLocation] = useState("");
  const [salesExecutive, setSalesExecutive] = useState("");
  const [remarks, setRemarks] = useState("");

  const [visitorId, setVisitorId] = useState("RWD-0001");

  async function generateVisitorId() {
    const { data } = await supabase
      .from("visitors")
      .select("visitor_id")
      .order("visitor_id", { ascending: false })
      .limit(1);

    if (!data || data.length === 0) {
      setVisitorId("RWD-0001");
      return;
    }

    const last = data[0].visitor_id || "RWD-0000";
    const number = parseInt(last.replace("RWD-", "")) + 1;

    setVisitorId(`RWD-${String(number).padStart(4, "0")}`);
  }

  useEffect(() => {
    generateVisitorId();

    setNow(new Date());

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { error } = await supabase.from("visitors").insert([
  {
    visitor_id: visitorId,
    visitor_type: visitorType,
    visitor_name: visitorName,
    mobile: mobile,
    company_name: company,
    branch: branch,
    city: city?.value || "",
    project_location: projectLocation,
    project_type: projectType,
    sales_executive: salesExecutive,
    remarks: remarks,
  },
]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Visitor Entry Saved Successfully");

  setVisitorType("");
  setProjectType("");
  setBranch("");
  setVisitorName("");
  setMobile("");
  setCompany("");
  setCity(null);
  setProjectLocation("");
  setSalesExecutive("");
  setRemarks("");

  await generateVisitorId();
};
return (
  <div className="min-h-screen bg-gray-100">

    {/* Header */}
    <div className="bg-[#031B2E] text-white py-4 px-4 md:py-8 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 lg:grid lg:grid-cols-[150px_1fr_260px] lg:items-center">

        {/* Logo */}
        <div className="flex justify-center lg:justify-start">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-24 h-24 lg:w-28 lg:h-28 object-contain mx-auto"
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">
            TOSTEM EXPERIENCE CENTER
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 mt-2">
            VISITOR ENTRY
          </h2>
        </div>

        {/* Date & Visitor ID */}
        <div className="w-full flex justify-center lg:justify-end">
          <div className="border border-gray-600 rounded-2xl p-6 w-[280px] bg-black/20 backdrop-blur-sm">
            <p>📅 {now?.toLocaleDateString()}</p>
            <p className="mt-2">🕒 {now?.toLocaleTimeString()}</p>

            <div className="mt-2 flex items-center gap-2 font-bold">
              <UserRound size={18} />
              <span>{visitorId}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    {/* Body */}
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 text-black">
        <form onSubmit={handleSubmit}>
          <h2 className="text-4xl font-bold mb-6"></h2>

{/* Visitor Type */}

<div className="mt-8">

  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-[#0B4EA2] rounded-lg flex items-center justify-center text-white font-bold text-2xl">
      1
    </div>

    <h3 className="text-2xl font-bold text-black">
      Visitor Type
    </h3>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8 gap-5">

    {[
      { name: "End Customer", icon: <Users size={24} /> },
      { name: "Architect", icon: <Compass size={24} /> },
      { name: "Builder", icon: <Building2 size={24} /> },
      { name: "Engineer", icon: <HardHat size={24} /> },
      { name: "Interior Designer", icon: <Sofa size={24} /> },
      { name: "Contractor", icon: <Handshake size={24} /> },
      { name: "Dealer", icon: <Store size={24} /> },
      { name: "Other", icon: <Ellipsis size={24} /> },
    ].map((item) => (
      <label
        key={item.name}
        className={`relative rounded-2xl min-h-[170px] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          visitorType === item.name
            ? "border-2 border-[#0B4EA2] bg-blue-50"
            : "border border-gray-300 hover:border-[#0B4EA2] hover:bg-blue-50"
        }`}
      >
        <input
          type="radio"
          name="visitorType"
          value={item.name}
          checked={visitorType === item.name}
          onChange={() => setVisitorType(item.name)}
          required
          className="absolute top-3 right-3 w-5 h-5 accent-[#0B4EA2]"
        />

        <div className="text-[#0B4EA2] mb-4">
          {item.icon}
        </div>

        <p className="mt-3 text-[15px] font-semibold leading-5 text-black">
          {item.name}
        </p>
      </label>
    ))}

  </div>

</div>
{/* Visitor Details */}

<div className="mt-8">

  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-[#0B4EA2] rounded-lg flex items-center justify-center text-white font-bold text-2xl">
      2
    </div>

    <h3 className="text-xl md:text-2xl font-bold">
      Visitor Details
    </h3>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* Visitor Name */}

    <div>
      <label className="font-semibold">
        Visitor Name *
      </label>

      <div className="mt-2 flex h-[54px] overflow-hidden rounded-xl border">
        <select className="w-16 border-r bg-white px-1 outline-none">
          <option>Mr.</option>
          <option>Mrs.</option>
          <option>Miss</option>
        </select>

        <div className="relative flex-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="text"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            required
            placeholder="Enter full name"
            className="w-full h-full pl-10 pr-4 outline-none"
          />
        </div>
      </div>
    </div>

    {/* Mobile */}

    <div>
      <label className="font-semibold">
        Mobile Number *
      </label>

      <div className="mt-2 flex h-[54px] overflow-hidden rounded-xl border">
        <select className="w-16 border-r bg-white px-1 outline-none">
          <option>+91</option>
          <option>+977</option>
          <option>+1</option>
          <option>+44</option>
        </select>

        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            placeholder="Enter mobile number"
            className="w-full h-full pl-10 pr-4 outline-none"
          />
        </div>
      </div>
    </div>

    {/* Company */}

    <div>
      <label className="font-semibold">
        Company / Firm Name
      </label>

      <div className="relative mt-2">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Enter company name"
          className="w-full h-[54px] border rounded-xl pl-10 pr-4"
        />
      </div>
    </div>

    {/* Branch */}

    <div>
      <label className="font-semibold">
        Branch *
      </label>

      <div className="relative mt-2">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          required
          className="w-full h-[54px] border rounded-xl pl-10 pr-4 outline-none"
        >
          <option value="">Select Branch</option>
          <option value="Indiranagar">Indiranagar</option>
          <option value="HSR Layout">HSR Layout</option>
        </select>
      </div>
    </div>

    {/* City */}

    <div>
      <label className="font-semibold">
        City *
      </label>

      <div className="relative mt-2">
        <MapPin
  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10"
/>

        <Select
  options={cityOptions}
  value={city}
  onChange={(selected: any) => setCity(selected)}
  placeholder="Search City..."
  isSearchable
  required
  styles={{
    control: (base) => ({
      ...base,
      minHeight: "54px",
      height: "54px",
      borderRadius: "12px",
      paddingLeft: "36px",
    }),

    valueContainer: (base) => ({
      ...base,
      paddingLeft: "8px",
    }),

    placeholder: (base) => ({
      ...base,
      marginLeft: "4px",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  }}
/>
      </div>
    </div>

    {/* Project Location */}

    <div>
      <label className="font-semibold">
        Project Location *
      </label>

      <div className="relative mt-2">
        <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          type="text"
          value={projectLocation}
          onChange={(e) => setProjectLocation(e.target.value)}
          required
          placeholder="Enter project location"
          className="w-full h-[54px] border rounded-xl pl-10 pr-4"
        />
      </div>
    </div>

  </div>

</div>
{/* Project Type */}

<div className="mt-8">

  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-[#0B4EA2] rounded-lg flex items-center justify-center text-white font-bold text-2xl">
      3
    </div>

    <h2 className="text-2xl font-bold">
      Select Project Type
    </h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

    {[
      {
        name: "Retail",
        icon: <Store size={26} />,
      },
      {
        name: "Project",
        icon: <Building2 size={26} />,
      },
      {
        name: "Renovation",
        icon: <Wrench size={26} />,
      },
    ].map((item) => (
      <label
        key={item.name}
        className={`relative h-[150px] p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          projectType === item.name
            ? "border-2 border-[#0B4EA2] bg-blue-50"
            : "border border-gray-300 hover:border-[#0B4EA2] hover:bg-blue-50"
        }`}
      >
        <input
          type="radio"
          name="projectType"
          value={item.name}
          checked={projectType === item.name}
          onChange={() => setProjectType(item.name)}
          required
          className="absolute top-3 right-3 w-5 h-5 accent-[#0B4EA2]"
        />

        <div className="text-[#0B4EA2] mb-4">
          {item.icon}
        </div>

        <p className="text-[15px] font-semibold text-center">
          {item.name}
        </p>
      </label>
    ))}

  </div>

</div>

{/* Sales Executive */}

<div className="mt-8">

  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-[#0B4EA2] rounded-lg flex items-center justify-center text-white font-bold">
      4
    </div>

    <h2 className="text-2xl font-bold">
      Sales Executive
    </h2>
  </div>

  <div className="relative mt-2">
    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />

    <select
      value={salesExecutive}
      onChange={(e) => setSalesExecutive(e.target.value)}
      className="w-full h-[54px] border rounded-xl pl-10 pr-4 outline-none"
    >
      <option value="">Select Sales Executive</option>
      <option>Ajith</option>
      <option>Aswani</option>
      <option>Sushrutha C J</option>
      <option>Aravind</option>
      <option>Ajay Nilkanthrao Dabhade</option>
      <option>Pratiksha</option>
    </select>
  </div>

</div>

{/* Remarks */}

<div className="mt-8">

  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-[#0B4EA2] rounded-lg flex items-center justify-center text-white font-bold text-2xl">
      5
    </div>

    <h2 className="text-2xl font-bold">
      Remarks (Optional)
    </h2>
  </div>

  <div className="relative mt-2">
    <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5" />

    <textarea
      rows={4}
      value={remarks}
      onChange={(e) => setRemarks(e.target.value)}
      placeholder="Enter remarks..."
      className="w-full border rounded-xl pl-12 pr-4 pt-4"
    />
  </div>

</div>

{/* Buttons */}

<div className="mt-10 flex flex-col md:flex-row gap-4">

  <button
    type="button"
    onClick={() => {
      setVisitorType("");
      setProjectType("");
      setBranch("");
      setVisitorName("");
      setMobile("");
      setCompany("");
      setCity(null);
      setProjectLocation("");
      setSalesExecutive("");
      setRemarks("");
    }}
    className="flex-1 border border-gray-300 rounded-xl py-4 font-semibold hover:bg-gray-100"
  >
    Reset
  </button>

  <button
    type="submit"
    className="flex-1 bg-yellow-500 text-white rounded-xl py-4 font-semibold hover:bg-yellow-600"
  >
    Submit Visitor Entry
  </button>

</div>

</form>

      </div>
    </div>
  </div>
);
}