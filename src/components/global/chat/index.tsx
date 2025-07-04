"use client";
import React, { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { Send, Mail } from "lucide-react";
import Typewriter from "./typewriter";
import WelcomeUser from "./Welcome";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";
import { selectChatId, selectResetFlag } from "@/store/chatSlice";
import { selectHistoryLoading, clearHistory } from "@/store/historySlice";
import { useLanguage } from "@/providers/language-providers";

/* ─── pastel‑green palette ─── */
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

/* ─── types ─── */
interface Message {
  text: string;
  sender: "user" | "ai";
}
interface EmailModalProps {
  messageContent: string;
  onClose: () => void;
}

/* ───────────────── Email Modal ───────────────── */
const EmailModal = ({ messageContent, onClose }: EmailModalProps) => {
  const [emailId, setEmailId] = useState("");
  const [subject, setSubject] = useState("AI Chat Message");
  const [body, setBody] = useState(messageContent);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(
    null
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const base =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      await axios.post(`${base}/send-email`, null, {
        params: { emailId, subject, body },
      });
      setStatus({ ok: true, msg: "Email sent successfully!" });
      setTimeout(onClose, 2000);
    } catch {
      setStatus({ ok: false, msg: "Failed to send email. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(255,255,255,0.6)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md p-6 rounded-lg shadow-lg"
        style={{ background: colorTheme.primarySoft }}
      >
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: colorTheme.primaryDark }}
        >
          Send message as email
        </h3>

        {status && (
          <p
            className={`mb-4 p-2 rounded ${
              status.ok
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.msg}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label
            className="block text-sm mb-1"
            style={{ color: colorTheme.gray500 }}
          >
            To
          </label>
          <input
            className="w-full mb-3 px-3 py-2 border rounded"
            style={{
              background: colorTheme.white,
              borderColor: colorTheme.gray200,
              color: colorTheme.primaryDarker,
            }}
            type="email"
            required
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
          />
          <label
            className="block text-sm mb-1"
            style={{ color: colorTheme.gray500 }}
          >
            Subject
          </label>
          <input
            className="w-full mb-3 px-3 py-2 border rounded"
            style={{
              background: colorTheme.white,
              borderColor: colorTheme.gray200,
              color: colorTheme.primaryDarker,
            }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <label
            className="block text-sm mb-1"
            style={{ color: colorTheme.gray500 }}
          >
            Message
          </label>
          <textarea
            rows={5}
            className="w-full mb-4 px-3 py-2 border rounded"
            style={{
              background: colorTheme.white,
              borderColor: colorTheme.gray200,
              color: colorTheme.primaryDarker,
            }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2 border rounded"
              style={{
                borderColor: colorTheme.gray200,
                color: colorTheme.primaryDarker,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 text-white rounded"
              style={{ background: colorTheme.primary }}
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ───────────────── Chatbox ───────────────── */
const Chatbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailText, setEmailText] = useState("");

  const { language } = useLanguage();

  const dispatch = useDispatch();
  const chatId = useSelector(selectChatId);
  const resetFlag = useSelector(selectResetFlag);
  const project = useSelector(selectCurrentProject);
  const historyLoading = useSelector(selectHistoryLoading);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const projectName = useCallback((): string => {
    if (typeof project === "string" && project.trim()) return project.trim();
    if (project && typeof project === "object") {
      return (
        project.name || project.title || project.projectTitle || "default"
      ).toString();
    }
    return "default";
  }, [project]);

  /* scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* reset */
  useEffect(() => {
    setMessages([]);
    dispatch(clearHistory());
  }, [resetFlag, dispatch]);

  /* ask AI */
  const askAI = async (q: string) => {
    setLoading(true);
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const endpoint = language === "arabic" ? "/rag-arabic" : "/rag";
    try {
      const res = await axios.get(`${base}${endpoint}`, {
        params: { query: q, chatId, projectName: projectName() },
      });
      return res.data;
    } catch {
      return "Sorry, I couldn't process your request.";
    } finally {
      setLoading(false);
    }
  };

  /* submit */
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setMessages((m) => [...m, { text: input, sender: "user" }]);
    setInput("");
    const ai = await askAI(input);
    setMessages((m) => [...m, { text: ai, sender: "ai" }]);
  };

  /* open email modal */
  const openEmail = (txt: string) => {
    setEmailText(txt);
    setEmailOpen(true);
  };

  /* loading history */
  if (historyLoading && chatId)
    return (
      <div
        className="flex flex-col items-center justify-center h-[calc(100vh-140px)]"
        style={{ background: colorTheme.primarySoft }}
      >
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: colorTheme.primary }}
        />
        <p className="mt-4 text-sm" style={{ color: colorTheme.gray500 }}>
          Loading chat history…
        </p>
      </div>
    );

  return (
    /* `group` needed for right‑sidebar hover states */
    <div
      className="flex flex-col h-[calc(100vh-140px)] group"
      style={{ background: colorTheme.primarySoft }}
    >
      {/* scroll‑area */}
      <div
        className={`relative flex-1 overflow-y-auto px-4 transition-[padding] duration-300 ${
          messages.length ? "pt-4" : ""
        } pr-[320px] group-hover:pr-4`}
      >
        {/* empty‑state overlay */}
        {messages.length === 0 && (
          <div className="absolute inset-0 grid place-items-center text-center px-6">
            <div>
              <div
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
                style={{ background: colorTheme.primaryLighter }}
              >
                💡
              </div>
              <h3
                className="mt-6 text-lg font-medium"
                style={{ color: colorTheme.primaryDark }}
              >
                Hi, how can I help you today?
              </h3>
              <p
                className="text-sm mt-1 max-w-sm mx-auto"
                style={{ color: colorTheme.gray500 }}
              >
                Feel free to ask any questions about your project!
              </p>
            </div>
          </div>
        )}

        {/* chat history */}
        {messages.length > 0 && (
          <div className="space-y-6 pb-20">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 mt-8 ${
                  m.sender === "user" ? "justify-end" : "justify-start -ml-6"
                }`}
              >
                {m.sender === "ai" && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: colorTheme.primaryLighter,
                      color: colorTheme.primaryDark,
                    }}
                  >
                    AI
                  </div>
                )}

                {/* bubble */}
                <div
                  className={`relative px-6 py-3.5 rounded-2xl max-w-[95%] whitespace-pre-wrap break-words group ${
                    m.sender === "user"
                      ? "rounded-tr-none"
                      : "rounded-tl-none text-white"
                  }`}
                  style={{
                    background:
                      m.sender === "user"
                        ? colorTheme.primaryLighter
                        : colorTheme.primary,
                    color:
                      m.sender === "user"
                        ? colorTheme.primaryDarker
                        : colorTheme.white,
                  }}
                  onMouseEnter={() => m.sender === "ai" && setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                >
                  {m.sender === "ai" && i === messages.length - 1 && !chatId ? (
                    <Typewriter text={m.text} speed={20} />
                  ) : (
                    m.text
                  )}

                  {m.sender === "ai" && hoverIdx === i && (
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.25)" }}
                      onClick={() => openEmail(m.text)}
                    >
                      <Mail size={16} color="#FFFFFF" />
                    </button>
                  )}
                </div>

                {m.sender === "user" && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: colorTheme.primaryLighter,
                      color: colorTheme.primaryDarker,
                    }}
                  >
                    U
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* input bar (slides left when sidebar shows) */}
      <div
        className="fixed bottom-0 left-64 right-0 border-t p-4 transition-[right] duration-300 group-hover:right-[320px]"
        style={{
          background: colorTheme.primarySoft,
          borderColor: colorTheme.gray200,
        }}
      >
        <form onSubmit={submit} className="max-w-4xl mx-auto flex gap-2">
          <input
            className="flex-1 px-4 py-2.5 rounded-full border focus:outline-none"
            style={{
              background: colorTheme.white,
              borderColor: colorTheme.gray200,
              color: colorTheme.primaryDarker,
            }}
            placeholder={
              language === "arabic" ? "اسألني أي شيء..." : "Ask me anything..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            disabled={loading}
            className="p-2.5 rounded-full text-white"
            style={{ background: colorTheme.primary }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

      {/* email modal */}
      {emailOpen && (
        <EmailModal
          messageContent={emailText}
          onClose={() => setEmailOpen(false)}
        />
      )}
    </div>
  );
};

export default Chatbox;
