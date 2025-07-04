"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectCurrentProject } from "@/store/projectSlice";

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

/* === shared colour palette === */
const colorTheme = {
  primary: "#5CAB7D",
  primaryLight: "#7DCCA0",
  primaryLighter: "#A8E6C3",  // pastel‑green
  primarySoft: "#ECF9F2",     // mint used for modal bg
  primaryDark: "#3D8C5F",
  primaryDarker: "#2A6A45",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  error: "#EF4444",
};

const Drawer = ({ open, onClose }: DrawerProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* current project from Redux */
  const currentProject = useSelector(selectCurrentProject);
  const projectName =
    typeof currentProject === "object" && currentProject
      ? currentProject.title || currentProject.name
      : typeof currentProject === "string"
      ? currentProject
      : null;

  const canSaveNote = Boolean(projectName) && Boolean(noteInput.trim());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && open && projectName) fetchNotes();
  }, [mounted, open, projectName]);

  const fetchNotes = async () => {
    if (!projectName) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get("http://localhost:8080/getNotes", {
        params: { projectName },
      });

      let parsed: Note[] = [];

      if (typeof res.data === "string") {
        try {
          const tmp = JSON.parse(res.data);
          parsed = Array.isArray(tmp) ? tmp : [tmp];
        } catch {
          parsed = [{ id: "1", content: res.data, timestamp: Date.now() }];
        }
      } else {
        parsed = Array.isArray(res.data) ? res.data : [res.data];
      }

      setNotes(parsed);

      if (parsed.length) {
        const latest = [...parsed].sort(
          (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
        )[0];
        setNoteInput(latest.content);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!canSaveNote) return;
    try {
      await axios.put(
        "http://localhost:8080/updateNotes",
        null,
        { params: { notes: noteInput.trim(), projectName } }
      );
      fetchNotes(); // refresh
    } catch {
      setError("Failed to save note. Please try again.");
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <>
      {/* ── translucent backdrop ── */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
      />

      {/* ── drawer ── */}
      <div
        className="fixed top-0 right-0 h-full w-80 shadow-lg z-50 transform transition-transform duration-300 ease-in-out translate-x-0"
        style={{ backgroundColor: colorTheme.primarySoft }}
      >
        {/* header */}
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{ borderColor: colorTheme.gray200 }}
        >
          <h2 className="text-lg font-semibold" style={{ color: colorTheme.primaryDark }}>
            {projectName ? `Notes: ${projectName}` : "Notes (No Project Selected)"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl"
            style={{ color: colorTheme.gray500 }}
          >
            ×
          </button>
        </div>

        {/* status */}
        {isLoading && (
          <div
            className="p-2 text-sm text-center"
            style={{
              backgroundColor: colorTheme.primaryLighter,
              color: colorTheme.primaryDarker,
            }}
          >
            Loading notes…
          </div>
        )}
        {error && (
          <div
            className="p-2 text-sm text-center"
            style={{ backgroundColor: "#FDE9E9", color: colorTheme.error }}
          >
            {error}
          </div>
        )}

        {/* textarea */}
        <div className="p-4 border-b" style={{ borderColor: colorTheme.gray200 }}>
          <textarea
            className="w-full border rounded-md p-2 h-64 focus:outline-none focus:ring-2"
            style={{
              borderColor: colorTheme.gray200,
              color: colorTheme.primaryDarker,
              backgroundColor: colorTheme.white,
              resize: "vertical",
              boxShadow: "none",
            }}
            placeholder={
              projectName ? "Write a note..." : "Select a project first..."
            }
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            disabled={!projectName || isLoading}
          />

          {/* footer row */}
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={handleSaveNote}
              disabled={!canSaveNote || isLoading}
              className="px-4 py-2 rounded-md transition-colors disabled:cursor-not-allowed"
              style={{
                backgroundColor: canSaveNote && !isLoading
                  ? colorTheme.primaryLighter
                  : "#DFF6EB",
                color: colorTheme.primaryDarker,
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.backgroundColor = colorTheme.primaryLight;
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.backgroundColor = colorTheme.primaryLighter;
              }}
            >
              Save Note
              {!projectName && (
                <span className="ml-1 text-xs opacity-70">(No project selected)</span>
              )}
            </button>

            {notes.length > 0 && (
              <span className="text-xs" style={{ color: colorTheme.gray500 }}>
                {notes.length} note{notes.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default Drawer;
