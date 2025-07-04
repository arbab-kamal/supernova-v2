"use client";
import React from "react";
import ArticleNavbar from "@/components/global/navbar";
import RightSidebar from "@/components/global/sidebar/rightside";
import Chatbox from "@/components/global/chat";

/* shared palette */
const colorTheme = {
    primarySoft: "#ECF9F2",
    gray200: "#E5E7EB",
};

const Chat = () => {
    return (
        /* `group` lets children react to sidebar hover */
        <div className="flex group">
            {/* left drawer width presumed 64 px */}
            <div className="flex-1 ml-64">
                {/* ── Navbar ───────────────────────────────────────────── */}
                <div
                    className="fixed top-0 left-64 right-0 border-b z-10"
                    style={{
                        backgroundColor: colorTheme.primarySoft,
                        borderColor: colorTheme.gray200,
                    }}
                >
                    <ArticleNavbar />
                </div>

                {/* ── Chat Area ────────────────────────────────────────── */}
                <div
                    /* Keep consistent padding - always reserve space for sidebar */
                    className="h-screen pt-14 pr-[320px]"
                    style={{ backgroundColor: colorTheme.primarySoft }}
                >
                    <Chatbox />
                </div>

                {/* ── Right Sidebar (slides on hover) ─────────────────── */}
                <div className="fixed top-14 right-0 bottom-0 z-20 group">
                    {/* 8 px handle that triggers the hover */}
                    <div className="absolute inset-y-0 right-0 w-2 cursor-pointer group-hover:w-[320px]" />

                    {/* panel - Added overflow-hidden and h-full */}
                    <div
                        className="absolute inset-y-0 right-0 w-[320px] h-full border-l transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out overflow-hidden"
                        style={{
                            backgroundColor: colorTheme.primarySoft,
                            borderColor: colorTheme.gray200,
                        }}
                    >
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;