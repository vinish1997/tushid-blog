import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardProfile from "../components/DashboardProfile";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const tabFromUrl = urlParam.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Side Bar */}
      <div className="md:w-56">
        <DashboardSidebar />
      </div>
      {/* Profile */}
      <div className="">{tab === "profile" && <DashboardProfile />}</div>
    </div>
  );
}
