"use client";
import React, { useState } from "react";
import {
  Moon,
  Menu,
  Bot,
  FileText,
  GitBranch,
  Info,
  Globe,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";                     // ← note drawer
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-providers";

/* ─── shared colour palette ─── */
const colorTheme = {
  primary: "#5CAB7D",
  primaryLight: "#7DCCA0",
  primaryLighter: "#A8E6C3",
  primarySoft: "#ECF9F2",
  primaryDark: "#3D8C5F",
  primaryDarker: "#2A6A45",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
};
/* -------------------------------- */

const ArticleNavbar = () => {
  const { setTheme, theme } = useTheme();
  const isDark = theme === "dark";
  const currentProject = useSelector(selectCurrentProject);

  const { language, setLanguage } = useLanguage();

  /* local state for the note drawer */
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  /* derived palette (same for light/dark except text contrast) */
  const colors = {
    bgMain: colorTheme.primarySoft,
    bgHover: colorTheme.primaryLighter,
    textPrimary: colorTheme.primaryDarker,
    textSecondary: colorTheme.gray500,
    border: colorTheme.gray200,
  };

  const handleLanguageChange = (lang: "english" | "arabic") =>
    setLanguage(lang);

  return (
    <>
      <div
        className="flex items-center justify-between px-4 py-3 w-full border-b"
        style={{ backgroundColor: colors.bgMain, borderColor: colors.border }}
      >
        {/* ── Left side ─────────────────────────────── */}
        <div className="flex items-center space-x-4">
          {/* Back / menu arrow – placeholder */}
          <button
            className="p-2 rounded-lg transition"
            style={{ color: colors.textPrimary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = colors.bgHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 px-3 py-2 border rounded-md transition"
              style={{ color: colors.textPrimary, borderColor: colors.border }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.bgHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Globe className="w-5 h-5" />
              <span>{language === "arabic" ? "العربية" : "English"}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => handleLanguageChange("english")}>
                🇬🇧 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("arabic")}>
                🇸🇦 العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── Right side ────────────────────────────── */}
        <div className="flex items-center space-x-3">
          {/* Current project display */}
          {currentProject && (
            <div
              className="flex items-center mr-2 border-r pr-3"
              style={{ borderColor: colors.border }}
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center mr-2"
                style={{
                  backgroundColor: colorTheme.primaryLighter,
                  color: colorTheme.primaryDark,
                }}
              >
                {typeof currentProject === "object" && currentProject.title
                  ? currentProject.title.charAt(0).toUpperCase()
                  : typeof currentProject === "string"
                  ? currentProject.charAt(0).toUpperCase()
                  : "P"}
              </div>
              <div>
                <h3
                  className="font-medium truncate max-w-[120px]"
                  style={{ color: colors.textPrimary }}
                >
                  {typeof currentProject === "object" && currentProject.title
                    ? currentProject.title
                    : typeof currentProject === "string"
                    ? currentProject
                    : "Project"}
                </h3>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  Project
                </p>
              </div>
            </div>
          )}

          {/* Create Note button */}
          <button
            onClick={() => setIsNoteOpen(true)}
            className="p-2 rounded-lg transition"
            style={{ color: colors.textPrimary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = colors.bgHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            title="New Note"
          >
            <FileText className="w-5 h-5" />
          </button>

          {/* Theme selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                style={{
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: "transparent",
                }}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* App menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="p-2 rounded-lg transition"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.bgHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Menu className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 shadow-md border rounded-lg mt-2"
              style={{ backgroundColor: colors.bgMain, borderColor: colors.border }}
            >
              <DropdownMenuItem asChild>
                <Link
                  href="/chat/agent"
                  className="flex items-center px-4 py-2 text-sm w-full"
                  style={{ color: colors.textPrimary }}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  AI Agent
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/documents"
                  className="flex items-center px-4 py-2 text-sm w-full"
                  style={{ color: colors.textPrimary }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/workflow"
                  className="flex items-center px-4 py-2 text-sm w-full"
                  style={{ color: colors.textPrimary }}
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  AI Workflow
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/about"
                  className="flex items-center px-4 py-2 text-sm w-full"
                  style={{ color: colors.textPrimary }}
                >
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

    </>
  );
};

export default ArticleNavbar;
