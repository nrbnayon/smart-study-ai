/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Bot, User, RefreshCw, Sparkles, Paperclip, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  files?: { name: string; type: string; url?: string }[];
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetMessageRef = useRef("");

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Typewriter effect to display characters smoothly
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      isTyping ||
      (messages.length > 0 &&
        messages[messages.length - 1]?.role === "assistant" &&
        messages[messages.length - 1]?.content.length <
          targetMessageRef.current.length)
    ) {
      interval = setInterval(() => {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];

          if (
            lastMessage.role === "assistant" &&
            lastMessage.content.length < targetMessageRef.current.length
          ) {
            // Type a few characters at a time for smooth but fast feel
            const nextLength = Math.min(
              lastMessage.content.length + 3,
              targetMessageRef.current.length,
            );
            lastMessage.content = targetMessageRef.current.slice(0, nextLength);
            return [...newMessages];
          }
          return prev;
        });
      }, 15);
    }
    return () => clearInterval(interval);
  }, [isTyping, messages.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 3) {
      toast.error("Maximum 3 files allowed");
      return;
    }

    // Filter for images, pdf, and docx
    const validFiles = files.filter((file) => {
      const isValid =
        file.type.startsWith("image/") ||
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword" ||
        file.type.startsWith("text/");

      if (!isValid) {
        toast.error(`Invalid file type: ${file.name}`);
      }
      return isValid;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;

    const currentFiles = [...selectedFiles];
    const userMessage: Message = {
      role: "user",
      content: input,
      files: currentFiles.map((f) => ({
        name: f.name,
        type: f.type,
        url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
      })),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedFiles([]);
    setIsLoading(true);
    setIsTyping(true);
    targetMessageRef.current = "";

    try {
      let response;
      if (currentFiles.length > 0) {
        const formData = new FormData();
        formData.append("messages", JSON.stringify([...messages, userMessage]));
        currentFiles.forEach((file) => {
          formData.append("files", file);
        });

        response = await fetch("/api/chat", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        });
      }

      if (!response.ok) throw new Error("Failed to fetch");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      // Add a placeholder message for the assistant
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let buffer = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

            const data = trimmedLine.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              if (content) {
                targetMessageRef.current += content;
              }
            } catch (e) {
              // Partial chunk, ignore
              console.error("Parse error:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = "Sorry, I encountered an error. Please try again.";
      targetMessageRef.current = errorMsg;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);
    } finally {
      setIsLoading(false);
      // Wait a bit for the typewriter to catch up before stopping the indicator
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast.success("Chat history cleared", {
      description: "You can start a new conversation now.",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Quizquestion AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-indigo-100">
                      Always Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10 rounded-full"
                  onClick={clearChat}
                  title="Clear Chat"
                >
                  <RefreshCw size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                    <Bot size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Hello! I&lsquo;m your AI tutor.
                  </h4>
                  <p className="text-sm text-gray-500 max-w-[200px]">
                    Ask me anything about SmartStudy AI or how I can help you
                    learn better.
                  </p>
                  <div className="grid grid-cols-1 gap-2 w-full mt-4">
                    {[
                      "Can you analyze this PDF for me?",
                      "Summarize this Word document",
                      "What's in this image?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                        }}
                        className="text-xs text-left p-3 rounded-xl bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all font-medium"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                        msg.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-indigo-100 text-indigo-600",
                      )}
                    >
                      {msg.role === "user" ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-sm shadow-sm markdown-container",
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white text-gray-800 border border-indigo-100 rounded-tl-none",
                      )}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc ml-4 mb-2">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal ml-4 mb-2">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="mb-1">{children}</li>
                          ),
                          code: ({ children }) => (
                            <code
                              className={cn(
                                "px-1 rounded text-xs font-mono",
                                msg.role === "user"
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-indigo-600",
                              )}
                            >
                              {children}
                            </code>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold">{children}</strong>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>

                      {msg.files && msg.files.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.files.map((file, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg text-[10px] font-medium border",
                                msg.role === "user"
                                  ? "bg-white/10 border-white/20 text-white"
                                  : "bg-indigo-50 border-indigo-100 text-indigo-700"
                              )}
                            >
                              {file.type.startsWith("image/") ? (
                                <div className="flex flex-col gap-1">
                                  {file.url && (
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className="max-w-[120px] max-h-[120px] rounded object-cover"
                                    />
                                  )}
                                  <span className="truncate max-w-[100px]">
                                    {file.name}
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <FileText size={12} />
                                  <span className="truncate max-w-[100px]">
                                    {file.name}
                                  </span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {isTyping && i === messages.length - 1 && (
                        <span className="inline-block w-1.5 h-4 ml-0.5 bg-indigo-400 animate-pulse align-middle" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white border border-indigo-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-indigo-50">
              {/* File Previews */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="group relative flex items-center gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100"
                    >
                      {file.type.startsWith("image/") ? (
                        <ImageIcon size={14} className="text-indigo-600" />
                      ) : (
                        <FileText size={14} className="text-indigo-600" />
                      )}
                      <span className="text-[10px] font-medium text-indigo-700 max-w-[80px] truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(idx)}
                        className="p-0.5 rounded-full hover:bg-indigo-200 text-indigo-600"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center gap-2"
              >
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something..."
                    className="w-full pl-10 pr-12 rounded-2xl border-indigo-100 focus:ring-indigo-500 focus:border-indigo-500 h-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || selectedFiles.length >= 3}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                  >
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
                  className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 shrink-0"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </form>
              <p className="text-[10px] text-center text-gray-400 mt-2">
                Powered by SmartStudy AI • Max 3 files (PDF, Doc, Image)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 25px rgba(79, 70, 229, 0.4)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative overflow-hidden group",
          isOpen
            ? "bg-white text-indigo-600 rotate-180"
            : "bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white",
        )}
      >
        {/* Animated Glow Effect */}
        {!isOpen && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
        )}

        {isOpen ? (
          <X size={32} />
        ) : (
          <div className="relative">
            <Sparkles size={32} className="animate-pulse" />
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-white rounded-full animate-ping opacity-20" />
            </div>
          </div>
        )}

        {/* Badge */}
        {!isOpen && messages.length === 0 && (
          <span className="absolute top-3 right-3 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-200 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;
