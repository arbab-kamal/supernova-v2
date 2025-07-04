"use client";
import React, { useState } from "react";
import Sidebar from "@/components/global/sidebar";
import Drawer from "@/components/global/sidebar/Drawer/drawer";

/* shared palette */
const colorTheme = {
  primarySoft: "#ECF9F2",
  gray200: "#E5E7EB",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: colorTheme.primarySoft }}
    >
      {/* sidebar (always visible) */}
      <div
        className="w-64 flex-shrink-0 border-r"
        style={{
          borderColor: colorTheme.gray200,
          backgroundColor: colorTheme.primarySoft,
        }}
      >
        <Sidebar />
      </div>

      {/* main area */}
      <div className="flex-1 flex flex-col">
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: colorTheme.primarySoft }}
        >
          {children}

          {/* notes drawer */}
          <Drawer open={notesOpen} onClose={() => setNotesOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
