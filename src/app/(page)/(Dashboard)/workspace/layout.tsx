"use client";
import React from "react";
import Sidebar from "@/components/global/sidebar";


const Layout = ({ children }) => {
  return (
    <div 
      className="flex h-screen"
    >
      {/* Sidebar (Always Present) */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col"
        style={{ backgroundColor: "white" }}
      >
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;