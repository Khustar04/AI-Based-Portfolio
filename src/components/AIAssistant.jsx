import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  Send,
  Loader2,
  User,
  Sparkles,
  Trash2,
  MoveHorizontal,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  streamGeminiResponse,
  generateSmartOfflineResponse,
  suggestedQuestions,
  adminSuggestedQuestions,
} from "../utils/aiAssistant";
import { usePortfolioData } from "../context/PortfolioDataContext";

export default function AIAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const portfolioData = usePortfolioData();
  const { personalInfo, isAdminAuthenticated } = portfolioData;

  const isAdminMode = location.pathname === "/manage-portfolio" && isAdminAuthenticated;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("portfolio_ai_chat_history_v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Failed to load chat history:", e);
      }
    }
    return [
      {
        role: "assistant",
        content: isAdminMode
          ? `⚡ **Admin Command Mode Active!**\n\nHello ${personalInfo?.name || "Khustar"}! I have direct control over your portfolio. You can command me to:\n• *Add a new project with technologies*\n• *Update your bio, email, or phone*\n• *Add or modify skills & certificates*\n• *Export backups or reset data*`
          : `Hi! I'm ${personalInfo?.firstName || personalInfo?.name || "Khustar"}'s AI Assistant. Ask me anything about his skills, projects, or tell me where you'd like to go on this portfolio! 🚀`,
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Persist conversation history to local storage
  useEffect(() => {
    if (messages && messages.length > 0) {
      try {
        localStorage.setItem("portfolio_ai_chat_history_v1", JSON.stringify(messages.slice(-40)));
      } catch {
        // Ignore quota
      }
    }
  }, [messages]);

  // Update greeting when entering/exiting Admin mode
  useEffect(() => {
    if (isAdminMode) {
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].role === "assistant") {
          return [
            {
              role: "assistant",
              content: `⚡ **Admin Command Mode Active!**\n\nHello ${personalInfo?.name || "Khustar"}! I have direct control over your portfolio. You can command me to:\n• *Add a new project with technologies*\n• *Update your bio, email, or phone*\n• *Add or modify skills & certificates*\n• *Export backups or reset data*`,
            },
          ];
        }
        return prev;
      });
    }
  }, [isAdminMode, personalInfo?.name]);

  // ----------------------------------------------------
  // Left-to-Right Horizontal Drag Only (Y-axis is fixed at bottom)
  // ----------------------------------------------------
  const [posX, setPosX] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ai_button_x");
      if (saved) {
        try {
          const parsed = Number(saved);
          if (!isNaN(parsed)) {
            return Math.min(Math.max(16, parsed), window.innerWidth - 76);
          }
        } catch {
          // fallback
        }
      }
      return Math.max(16, window.innerWidth - 80);
    }
    return 100;
  });

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const initialPosXRef = useRef(0);
  const hasMovedRef = useRef(false);
  const posXRef = useRef(posX);

  useEffect(() => {
    posXRef.current = posX;
  }, [posX]);

  // Keep button within window bounds on resize
  useEffect(() => {
    const handleResize = () => {
      setPosX((prev) => {
        const next = Math.min(Math.max(16, prev), window.innerWidth - 76);
        posXRef.current = next;
        return next;
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    dragStartXRef.current = clientX;
    initialPosXRef.current = posXRef.current;
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!isDraggingRef.current) return;
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
      const deltaX = clientX - dragStartXRef.current;

      if (Math.abs(deltaX) > 4) {
        hasMovedRef.current = true;
        if (e.cancelable) e.preventDefault();
      }

      const newX = Math.min(
        Math.max(16, initialPosXRef.current + deltaX),
        window.innerWidth - 76
      );

      posXRef.current = newX;
      setPosX(newX);
    };

    const onUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        localStorage.setItem("ai_button_x", String(posXRef.current));
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const handleButtonClick = () => {
    if (!hasMovedRef.current) {
      setIsOpen((prev) => !prev);
    }
  };

  // ----------------------------------------------------
  // Navigation & Action Helper (Auto-closes chat on click)
  // ----------------------------------------------------
  const handleNavigateAction = (target) => {
    setIsOpen(false);

    if (!target) return;

    if (/^https?:\/\//i.test(target) || target.startsWith("mailto:") || target.startsWith("tel:")) {
      window.open(target, "_blank", "noopener,noreferrer");
      return;
    }

    if (target.startsWith("#")) {
      navigate({ pathname: "/", hash: target.slice(1) });
      return;
    }

    navigate(target);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput("");

    const currentHistory = [...messages, { role: "user", content: userMessage }];
    setMessages([...currentHistory, { role: "assistant", content: "" }]);
    setIsLoading(true);

    const applyAssistantText = (text) => {
      if (!text) return;
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].role === "assistant") {
          updated[updated.length - 1].content = text;
        }
        return updated;
      });
    };

    try {
      const result = await streamGeminiResponse(
        userMessage,
        currentHistory,
        applyAssistantText,
        isAdminMode,
        portfolioData,
        portfolioData
      );
      applyAssistantText(result);
    } catch (err) {
      console.warn("AI streaming error, resolving with Smart Knowledge Engine:", err);
      const smartFallback = generateSmartOfflineResponse(
        userMessage,
        portfolioData,
        isAdminMode,
        portfolioData
      );
      applyAssistantText(smartFallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: isAdminMode
          ? `⚡ **Admin Command Mode Active!** Ready for your next command or update instruction.`
          : `Hi! I'm ${personalInfo?.firstName || personalInfo?.name || "Khustar"}'s AI Assistant. How can I help you navigate or answer questions today?`,
      },
    ]);
    try {
      localStorage.removeItem("portfolio_ai_chat_history_v1");
    } catch {
      // Ignore
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ----------------------------------------------------
  // Markdown & Link Parser
  // ----------------------------------------------------
  const renderMessageContent = (content) => {
    if (!content) return null;

    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", value: content.substring(lastIndex, match.index) });
      }
      parts.push({ type: "code", lang: match[1] || "code", value: match[2] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
      parts.push({ type: "text", value: content.substring(lastIndex) });
    }

    return parts.map((part, pIdx) => {
      if (part.type === "code") {
        return (
          <div key={pIdx} className="my-2.5 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 text-xs shadow-md">
            <div className="bg-slate-800 px-3 py-1.5 text-[10px] font-mono text-blue-400 font-semibold uppercase tracking-wider border-b border-slate-700/80 flex items-center justify-between">
              <span>{part.lang}</span>
              <span className="text-slate-500 lowercase text-[9px]">code</span>
            </div>
            <pre className="p-3.5 font-mono text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
              <code>{part.value.trim()}</code>
            </pre>
          </div>
        );
      }

      const lines = part.value.split("\n");
      return (
        <span key={pIdx} className="space-y-1 block">
          {lines.map((rawLine, lineIdx) => {
            if (!rawLine.trim()) {
              return <span key={lineIdx} className="block h-1.5" />;
            }

            let line = rawLine;

            const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
            let isHeader = false;
            let headerLevel = 0;
            if (headerMatch) {
              isHeader = true;
              headerLevel = headerMatch[1].length;
              line = headerMatch[2].trim();
            }

            const bulletMatch = line.match(/^(\s*)([•\-\*\+])\s+(.*)$/);
            const isBullet = !isHeader && Boolean(bulletMatch);
            if (isBullet && bulletMatch) {
              line = bulletMatch[3].trim();
            }

            const numberMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
            const isNumbered = !isHeader && !isBullet && Boolean(numberMatch);
            let itemNumber = "";
            if (isNumbered && numberMatch) {
              itemNumber = numberMatch[2];
              line = numberMatch[3].trim();
            }

            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            const segmentsWithLinks = [];
            let linkLastIdx = 0;
            let linkMatch;

            while ((linkMatch = linkRegex.exec(line)) !== null) {
              if (linkMatch.index > linkLastIdx) {
                segmentsWithLinks.push({ type: "plain", value: line.substring(linkLastIdx, linkMatch.index) });
              }
              segmentsWithLinks.push({ type: "link", label: linkMatch[1], url: linkMatch[2] });
              linkLastIdx = linkMatch.index + linkMatch[0].length;
            }
            if (linkLastIdx < line.length) {
              segmentsWithLinks.push({ type: "plain", value: line.substring(linkLastIdx) });
            }

            const formatPlainText = (text) => {
              const inlineRegex = /(\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_)/g;
              const parts = [];
              let last = 0;
              let m;

              while ((m = inlineRegex.exec(text)) !== null) {
                if (m.index > last) {
                  parts.push({ type: "text", val: text.substring(last, m.index).replace(/[\*#_]{2,}/g, "") });
                }

                if (m[2] || m[3]) {
                  parts.push({ type: "bold", val: m[2] || m[3] });
                } else if (m[4]) {
                  parts.push({ type: "code", val: m[4] });
                } else if (m[5] || m[6]) {
                  parts.push({ type: "italic", val: m[5] || m[6] });
                }

                last = m.index + m[0].length;
              }

              if (last < text.length) {
                parts.push({ type: "text", val: text.substring(last).replace(/[\*#_]{2,}/g, "") });
              }

              return parts.map((seg, segIdx) => {
                if (seg.type === "bold") {
                  return (
                    <strong key={segIdx} className="font-bold text-gray-900 dark:text-white">
                      {seg.val}
                    </strong>
                  );
                }
                if (seg.type === "code") {
                  return (
                    <code
                      key={segIdx}
                      className="px-1.5 py-0.5 mx-0.5 rounded bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-mono text-xs border border-blue-100 dark:border-slate-700"
                    >
                      {seg.val}
                    </code>
                  );
                }
                if (seg.type === "italic") {
                  return (
                    <em key={segIdx} className="italic text-gray-800 dark:text-gray-200">
                      {seg.val}
                    </em>
                  );
                }
                return <span key={segIdx}>{seg.val}</span>;
              });
            };

            const parsedLineContent = segmentsWithLinks.map((seg, sIdx) => {
              if (seg.type === "link") {
                return (
                  <button
                    key={sIdx}
                    onClick={() => handleNavigateAction(seg.url)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 my-1 mx-1 text-xs font-semibold bg-blue-50/90 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/70 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-xs cursor-pointer"
                  >
                    <span>{seg.label}</span>
                    <ArrowRight size={11} />
                  </button>
                );
              }
              return <span key={sIdx}>{formatPlainText(seg.value)}</span>;
            });

            if (isHeader) {
              return (
                <div
                  key={lineIdx}
                  className={`font-bold text-gray-900 dark:text-white mt-2 mb-1 ${
                    headerLevel <= 2 ? "text-base text-blue-600 dark:text-blue-400" : "text-sm"
                  }`}
                >
                  {parsedLineContent}
                </div>
              );
            }

            if (isBullet) {
              return (
                <div key={lineIdx} className="flex items-start gap-2 pl-1 my-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xs mt-1 shrink-0">•</span>
                  <div className="flex-1">{parsedLineContent}</div>
                </div>
              );
            }

            if (isNumbered) {
              return (
                <div key={lineIdx} className="flex items-start gap-2 pl-1 my-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xs mt-0.5 shrink-0">
                    {itemNumber}.
                  </span>
                  <div className="flex-1">{parsedLineContent}</div>
                </div>
              );
            }

            return (
              <div key={lineIdx} className="leading-relaxed">
                {parsedLineContent}
              </div>
            );
          })}
        </span>
      );
    });
  };

  const isRightSide = posX > (typeof window !== "undefined" ? window.innerWidth / 2 : 500);
  const activeQuestions = isAdminMode ? adminSuggestedQuestions : suggestedQuestions;

  return (
    <>
      {/* Horizontally Draggable AI Button */}
      <div
        style={{
          position: "fixed",
          left: `${posX}px`,
          bottom: "24px",
          zIndex: 60,
          touchAction: "pan-y",
        }}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        className="select-none cursor-ew-resize group"
      >
        <button
          onClick={handleButtonClick}
          className={`w-14 h-14 rounded-full flex items-center justify-center border border-slate-200/90 dark:border-slate-700/80 shadow-xl transition-all duration-200 cursor-pointer ${
            isOpen
              ? "bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rotate-90"
              : isAdminMode
              ? "bg-gradient-to-tr from-amber-500 to-indigo-600 border-amber-400 text-white shadow-amber-500/25 group-hover:scale-105"
              : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 group-hover:scale-105"
          }`}
          aria-label="AI Assistant"
        >
          {isOpen ? (
            <X size={24} className={isAdminMode ? "text-amber-400" : "text-slate-800 dark:text-white"} />
          ) : (
            <div className="relative flex items-center justify-center">
              {isAdminMode ? (
                <Zap size={26} className="text-white fill-amber-300 drop-shadow-md" />
              ) : (
                <img src="/ai-icon.svg" alt="AI" className="w-7 h-7 object-contain drop-shadow-sm" />
              )}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAdminMode ? "bg-amber-400" : "bg-blue-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isAdminMode ? "bg-amber-500" : "bg-blue-500"}`}></span>
              </span>
            </div>
          )}
        </button>

        {/* Horizontal Drag Hint on hover */}
        {!isOpen && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap flex items-center gap-1">
            <MoveHorizontal size={10} />
            <span>{isAdminMode ? "Admin AI" : "Slide left/right"}</span>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      <div
        style={{
          position: "fixed",
          left: isRightSide ? "auto" : `${Math.max(16, Math.min(posX, (typeof window !== "undefined" ? window.innerWidth : 1200) - 430))}px`,
          right: isRightSide ? `${Math.max(16, (typeof window !== "undefined" ? window.innerWidth : 1200) - posX - 64)}px` : "auto",
          bottom: "85px",
          maxHeight: "calc(100vh - 100px)",
          zIndex: 55,
        }}
        className={`w-[420px] max-w-[calc(100vw-32px)] h-[min(520px,calc(100vh-105px))] transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 dark:border-slate-700/60 overflow-hidden flex flex-col h-full">
          {/* Header */}
          <div
            className={`px-5 py-3.5 flex items-center justify-between text-white shadow-sm transition-colors shrink-0 ${
              isAdminMode
                ? "bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 border-b border-amber-500/30"
                : "bg-blue-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-inner ${
                  isAdminMode ? "bg-amber-500/20 border border-amber-400/40 text-amber-400" : "bg-white/20 text-white"
                }`}
              >
                {isAdminMode ? <ShieldCheck size={20} /> : <Sparkles size={18} />}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm">
                    {isAdminMode ? "FRIDAY (ADMIN COMMAND)" : "FRIDAY"}
                  </p>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wide ${
                      isAdminMode
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                        : "bg-blue-500/60 text-white"
                    }`}
                  >
                    {isAdminMode ? "⚡ Full Access" : "Fast AI ⚡"}
                  </span>
                </div>
                <p className="text-blue-100 text-xs">
                  {isAdminMode
                    ? "Direct portfolio management commands active"
                    : "Ask questions or jump to any section"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear chat"
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Section Jump Bar (Public Mode Only) */}
          {!isAdminMode && (
            <div className="px-3 py-2 bg-blue-50/70 dark:bg-slate-800/80 border-b border-blue-100/50 dark:border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar shrink-0">
              <span className="text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1 shrink-0 pl-1">
                <Compass size={12} className="text-blue-600 dark:text-blue-400" />
                <span>Jump:</span>
              </span>
              {[
                { label: "Skills", target: "#skills" },
                { label: "Projects", target: "#projects" },
                { label: "Resume", target: "/resume" },
                { label: "Contact", target: "#contact" },
                { label: "Education", target: "#education" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleNavigateAction(btn.target)}
                  className="px-2 py-0.5 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-md border border-gray-200 dark:border-slate-600 transition-colors shrink-0 cursor-pointer font-medium"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-4 bg-slate-50/60 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : isAdminMode
                      ? "bg-amber-50 dark:bg-slate-900 border border-amber-400/80 text-amber-600 dark:text-amber-400"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={14} />
                  ) : isAdminMode ? (
                    <Zap size={14} className="fill-amber-500 text-amber-500" />
                  ) : (
                    <img src="/ai-icon.svg" alt="AI" className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[84%] px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm shadow-blue-500/20"
                      : isAdminMode
                      ? "bg-white dark:bg-slate-800/95 border border-indigo-100 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-bl-sm shadow-sm"
                      : "bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-xs"
                  }`}
                >
                  {msg.content ? (
                    msg.role === "assistant" ? (
                      renderMessageContent(msg.content)
                    ) : (
                      msg.content
                    )
                  ) : (
                    <div className="flex gap-1.5 items-center py-1">
                      <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0ms] ${isAdminMode ? "bg-amber-500" : "bg-blue-600 dark:bg-blue-400"}`} />
                      <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms] ${isAdminMode ? "bg-amber-500" : "bg-blue-600 dark:bg-blue-400"}`} />
                      <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms] ${isAdminMode ? "bg-amber-500" : "bg-blue-600 dark:bg-blue-400"}`} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions / Commands */}
          {messages.length <= 2 && (
            <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 max-h-32 overflow-y-auto shrink-0">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <span>{isAdminMode ? "⚡ Suggested Admin Commands:" : "💡 Suggested questions:"}</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer border text-left ${
                      isAdminMode
                        ? "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-700/50 dark:text-amber-300"
                        : "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 bg-white dark:bg-slate-900 shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  isAdminMode
                    ? "Give an admin command (e.g. 'Add project X with tech Y')..."
                    : "Ask anything or 'take me to projects'..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3.5 py-2.5 text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md ${
                  isAdminMode
                    ? "bg-gradient-to-tr from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 shadow-amber-500/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                }`}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
