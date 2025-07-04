
"use client";
import React, { useState } from "react";
import Sidebar from "@/components/global/sidebar";
import Drawer from "@/components/global/sidebar/Drawer/drawer";

/* shared palette */
const colorTheme = {
  primarySoft: "#FFFFFF",
  gray200: "#E5E7EB",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Fixed Left Sidebar */}
      <div
        className="fixed top-0 left-0 bottom-0 w-64 border-r z-30"
        style={{
          borderColor: colorTheme.gray200,
          backgroundColor: colorTheme.primarySoft,
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content Area - Account for fixed sidebar */}
      <div className="flex-1 ml-64">
        {children}
      </div>

      {/* Notes Drawer */}
      <Drawer open={notesOpen} onClose={() => setNotesOpen(false)} />
    </div>
  );
};

export default Layout;