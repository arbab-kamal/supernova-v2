"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  Clock,
  ExternalLink,
  AlertCircle,
  Search,
} from "lucide-react";
import SharedNoteDrawer from "./drawer";

/* ───── shared colour palette ───── */
const colorTheme = {
  primary: "#5CAB7D",
  primaryLight: "#7DCCA0",
  primaryLighter: "#A8E6C3", // pastel‑green
  primarySoft: "#ECF9F2",    // mint‑green bg
  primaryDark: "#3D8C5F",
  primaryDarker: "#2A6A45",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  error: "#EF4444",
};
/* ──────────────────────────────── */

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

interface ProcessedNote {
  id: string;
  shareId: string;
  projectName: string;
  senderName: string;
  content: string;
  projectId: string;
  createdAt: string;
}

const SharedNotesList = () => {
  const [sharedNotes, setSharedNotes] = useState<ProcessedNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState<ProcessedNote | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  const fetchSharedNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8080/getSharedNotes", {
        headers: { Accept: "application/json" },
      });

      if (Array.isArray(res.data)) {
        const processed = res.data.map((n: SharedNote): ProcessedNote => ({
          id: n.sharedNotesId,
          shareId: n.sharedNotesId,
          projectName: n.projectName || "Unnamed Project",
          senderName: n.senderName || "Unknown Sender",
          content: n.notes || "",
          projectId: n.projectId || "",
          createdAt: n.date || "",
        }));
        setSharedNotes(processed);
      } else {
        setSharedNotes([]);
      }
    } catch (err) {
      setError("Failed to fetch shared notes");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "Unknown date";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const openDrawer = (note: ProcessedNote) => {
    setSelectedNote(note);
    setIsDrawerOpen(true);
  };

  const filtered = sharedNotes.filter(
    (n) =>
      n.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ───────────────────────── render ───────────────────────── */
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colorTheme.primaryDark }}>
          Shared Notes
        </h1>
        <button
          onClick={fetchSharedNotes}
          className="px-4 py-2 rounded text-white transition"
          style={{ backgroundColor: colorTheme.primary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = colorTheme.primaryLight)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = colorTheme.primary)
          }
        >
          Refresh
        </button>
      </div>

      {/* status bar */}
      <div
        className="p-4 mb-4 rounded-lg"
        style={{
          backgroundColor: isLoading
            ? colorTheme.primaryLighter
            : error
            ? "#FDE9E9"
            : sharedNotes.length === 0
            ? colorTheme.gray100
            : colorTheme.primarySoft,
        }}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin mr-2">
              <div
                className="h-5 w-5 border-2 rounded-full"
                style={{
                  borderColor: colorTheme.primary,
                  borderTopColor: "transparent",
                }}
              />
            </div>
            <span style={{ color: colorTheme.primaryDarker }}>
              Loading shared notes…
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" color={colorTheme.error} />
            <span style={{ color: colorTheme.error }}>
              Error: {error}
            </span>
          </div>
        ) : sharedNotes.length === 0 ? (
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" color={colorTheme.gray400} />
            <span style={{ color: colorTheme.gray500 }}>
              You don’t have any shared notes
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <FileText
              className="h-5 w-5 mr-2"
              color={colorTheme.primaryDark}
            />
            <span style={{ color: colorTheme.primaryDark }}>
              You have {sharedNotes.length} shared note
              {sharedNotes.length !== 1 && "s"}
            </span>
          </div>
        )}
      </div>

      {/* search */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5" color={colorTheme.gray400} />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none"
          style={{
            borderColor: colorTheme.gray200,
            color: colorTheme.primaryDarker,
          }}
          placeholder="Search by project or sender name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={(e) =>
            e.currentTarget.classList.add("ring-2") &&
            (e.currentTarget.style.boxShadow = `0 0 0 2px ${colorTheme.primaryLight}`)
          }
          onBlur={(e) => {
            e.currentTarget.classList.remove("ring-2");
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* list */}
      {!isLoading && !error && (
        <div className="rounded-lg shadow overflow-hidden" style={{ background: colorTheme.white }}>
          <ul className="divide-y" style={{ borderColor: colorTheme.gray200 }}>
            {filtered.length ? (
              filtered.map((n) => (
                <li
                  key={n.id}
                  className="p-4 cursor-pointer transition"
                  onClick={() => openDrawer(n)}
                  style={{ borderColor: colorTheme.gray200 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colorTheme.primarySoft)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colorTheme.white)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <FileText
                        className="h-5 w-5 mt-1"
                        color={colorTheme.primary}
                      />
                      <div>
                        <h3 className="text-lg font-medium" style={{ color: colorTheme.primaryDark }}>
                          {n.projectName}
                        </h3>
                        <p className="text-sm" style={{ color: colorTheme.gray500 }}>
                          Shared by: {n.senderName}
                        </p>
                        <div className="flex items-center mt-1 text-xs" style={{ color: colorTheme.gray400 }}>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(n.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5" color={colorTheme.gray400} />
                  </div>
                </li>
              ))
            ) : (
              <li className="p-6 text-center" style={{ color: colorTheme.gray500 }}>
                No notes matching your search
              </li>
            )}
          </ul>
        </div>
      )}

      {/* drawer */}
      {selectedNote && (
        <SharedNoteDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          shareId={selectedNote.shareId}
          projectName={selectedNote.projectName}
          projectId={selectedNote.projectId}
          senderName={selectedNote.senderName}
          noteContent={selectedNote.content}
        />
      )}
    </div>
  );
};

export default SharedNotesList;
