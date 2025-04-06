
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64">
        <div className="container mx-auto py-6 px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
