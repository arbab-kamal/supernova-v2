"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface SharedNoteDrawerProps {
  open: boolean;
  onClose: () => void;
  shareId: string | null;
  projectName: string | null;
  projectId: string | null;
  senderName: string | null;
  noteContent: string | null;
}

interface SharedNote {
  sharedNotesId: string;
  senderId: string;
  senderName: string;
  projectName: string;
  projectId: string;
  notes: string;
  date: string;
  receiverId: string;
}

/* ─── shared colour palette ─── */
const colorTheme = {
  primary: "#5CAB7D",
  primaryLight: "#7DCCA0",
  primaryLighter: "#A8E6C3", // pastel‑green
  primarySoft: "#ECF9F2",    // mint bg
  primaryDark: "#3D8C5F",
  primaryDarker: "#2A6A45",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  error: "#EF4444",
};
/* ───────────────────────────── */

const SharedNoteDrawer = ({
  open,
  onClose,
  shareId,
  projectName,
  projectId,
  senderName,
  noteContent,
}: SharedNoteDrawerProps) => {
  const [content, setContent] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  /* reset error when closing */
  useEffect(() => {
    if (!open) setError(null);
  }, [open]);

  /* populate content */
  useEffect(() => {
    if (mounted && open) {
      if (noteContent) {
        setContent(noteContent);
        setIsLoading(false);
      } else if (shareId) {
        fetchSharedNoteContent();
      }
    }
  }, [mounted, open, shareId, noteContent]);

  const fetchSharedNoteContent = async () => {
    if (!shareId) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/getSharedNotes", {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

      const data = await res.json();
      const match = Array.isArray(data)
        ? data.find((n: SharedNote) => n.sharedNotesId === shareId)
        : null;

      if (match) {
        setContent(match.notes || "");
        setDate(match.date || null);
      } else {
        setContent("");
        setDate(null);
        setError("Note not found.");
      }
    } catch {
      setError("Failed to load note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleString();
  };

  if (!mounted || !open) return null;

  return createPortal(
    <>
      {/* translucent backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40"
        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* drawer */}
      <div
        className="fixed top-0 right-0 h-full w-96 shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
        style={{ backgroundColor: colorTheme.primarySoft }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* header */}
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{ borderColor: colorTheme.gray200 }}
        >
          <div className="flex-1 mr-2">
            <h2
              id="drawer-title"
              className="text-lg font-semibold truncate"
              style={{ color: colorTheme.primaryDark }}
            >
              {projectName || "Shared Note"}
            </h2>
            {senderName && (
              <p className="text-sm" style={{ color: colorTheme.gray500 }}>
                Shared by: {senderName}
              </p>
            )}
            {date && (
              <p className="text-xs" style={{ color: colorTheme.gray400 }}>
                {formatDate(date)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xl p-2 rounded-full transition-colors"
            style={{ color: colorTheme.gray500 }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = colorTheme.gray100)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* body */}
        <div className="p-4 h-[calc(100%-5rem)] overflow-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div
                className="inline-block w-7 h-7 border-2 rounded-full animate-spin"
                style={{
                  borderColor: colorTheme.primary,
                  borderTopColor: "transparent",
                }}
              />
              <p className="mt-2" style={{ color: colorTheme.gray500 }}>
                Loading note…
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p style={{ color: colorTheme.error }}>{error}</p>
              <button
                onClick={fetchSharedNoteContent}
                className="mt-4 px-4 py-2 rounded transition-colors"
                style={{
                  backgroundColor: colorTheme.primaryLighter,
                  color: colorTheme.primaryDarker,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    colorTheme.primaryLight)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    colorTheme.primaryLighter)
                }
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div
                className="w-full h-full p-4 border rounded-lg overflow-auto whitespace-pre-wrap"
                style={{
                  backgroundColor: colorTheme.white,
                  borderColor: colorTheme.gray200,
                  color: colorTheme.primaryDarker,
                }}
              >
                {content || "No content available"}
              </div>
              {projectId && (
                <div className="mt-4 text-right">
                  <span
                    className="text-xs"
                    style={{ color: colorTheme.gray400 }}
                  >
                    Project ID: {projectId}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default SharedNoteDrawer;
