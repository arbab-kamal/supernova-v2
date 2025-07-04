"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import axios from "axios";
import { useTheme } from "next-themes";

/* ─── shared pastel‑green palette ─── */
const colorTheme = {
  primary: "#5CAB7D",
  primaryLight: "#7DCCA0",
  primaryLighter: "#A8E6C3",
  primarySoft: "#FFFFFF",
  primaryDark: "#3D8C5F",
  primaryDarker: "#2A6A45",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  error: "#EF4444",
};
/* ----------------------------------- */

interface WelcomeUserProps {
  className?: string;
}
interface UserData {
  username: string;
}

const WelcomeUser: React.FC<WelcomeUserProps> = ({ className = "" }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* brighter card bg for dark mode */
  const cardBg = isDark ? colorTheme.primaryLighter : colorTheme.primarySoft;

  /* fetch username once */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/userName", {
          withCredentials: true,
        });

        /* normalise response */
        let username = "";
        if (typeof res.data === "string") username = res.data.trim();
        else if (res.data && typeof res.data === "object") {
          username =
            res.data.username ??
            res.data.name ??
            (typeof Object.values(res.data)[0] === "string"
              ? (Object.values(res.data)[0] as string)
              : "");
        }
        setUser(username ? { username } : null);
      } catch (e: any) {
        /* ignore 401 (guest) */
        if (axios.isAxiosError(e) && e.response?.status !== 401) {
          setErr("Error fetching username");
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  /* reusable text colours */
  const headingColor = colorTheme.primaryDark;
  const subColor = colorTheme.gray500;

  return (
    <div
      className={`p-4 rounded-lg ${className}`}
      style={{ backgroundColor: cardBg }}
    >
      {loading ? (
        <p style={{ color: subColor }}>Loading…</p>
      ) : err ? (
        <p style={{ color: colorTheme.error }}>{err}</p>
      ) : (
        <div className="flex items-center gap-3">
          <User className="w-6 h-6" color={subColor} />
          <div>
            <h2 className="text-lg font-semibold" style={{ color: headingColor }}>
              {user ? `Welcome back, ${user.username}!` : "Welcome, Guest!"}
            </h2>
            <p className="text-sm" style={{ color: subColor }}>
              {user
                ? "We're glad to see you again."
                : "Please log in to access all features."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeUser;
