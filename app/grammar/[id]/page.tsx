"use client";

import { use, useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTenseById } from "@/lib/grammarData";
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  PenTool,
  Volume2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ConversationLine {
  speaker: string;
  text: string;
}

interface Conversation {
  title: string;
  speakers: string[];
  lines: ConversationLine[];
}

export default function GrammarDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const tense = getTenseById(id);

  const [activeTab, setActiveTab] = useState<
    "theory" | "communication" | "conversation"
  >("theory");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const cachedConversation = useQuery(
    api.ai.getCachedConversation,
    tense ? { tenseName: tense.name } : "skip"
  );
  const generateConversation = useAction(api.ai.generateConversation);

  // Load hội thoại đã cache
  useEffect(() => {
    if (cachedConversation && !conversation) {
      setConversation(cachedConversation as Conversation);
    }
  }, [cachedConversation, conversation]);

  const speakText = (text: string) => {
    const cleanText = text.replace(/\*\*/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const handleGenerateConversation = async (forceNew = false) => {
    if (!tense) return;
    setIsLoadingConversation(true);
    try {
      const result = await generateConversation({
        tenseName: tense.name,
        forceNew,
      });
      setConversation(result as unknown as Conversation);
    } catch (error) {
      console.error("Failed to generate conversation:", error);
    } finally {
      setIsLoadingConversation(false);
    }
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={i} className="text-accent font-bold">
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (!tense) {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-400">Không tìm thấy thì ngữ pháp này.</p>
          <Link href="/grammar" className="btn-primary mt-4 inline-flex">
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "theory" as const, label: "Lý Thuyết", icon: BookOpen },
    { key: "communication" as const, label: "Giao Tiếp", icon: MessageSquare },
    { key: "conversation" as const, label: "Hội Thoại AI", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/grammar"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft size={20} />
            Danh sách thì
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{tense.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{tense.name}</h1>
              <p className="text-accent text-lg">{tense.nameVi}</p>
            </div>
          </div>
          <p className="text-gray-400">{tense.description}</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "bg-black/30 text-gray-400 hover:bg-white/5"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Theory Tab */}
        {activeTab === "theory" && (
          <div className="space-y-6">
            {/* Structure */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                🧩 Công Thức
              </h3>
              <div className="bg-black/40 rounded-xl p-4">
                <code className="text-accent text-lg">{tense.structure}</code>
              </div>
            </div>

            {/* Usage */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                📝 Cách Dùng
              </h3>
              <ul className="space-y-2">
                {tense.usage.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-gray-300"
                  >
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Signal Words */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                🔎 Dấu Hiệu Nhận Biết
              </h3>
              <div className="flex flex-wrap gap-2">
                {tense.signalWords.map((word, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-accent/15 text-accent rounded-lg text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                💬 Ví Dụ
              </h3>
              <div className="space-y-4">
                {tense.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="bg-black/30 rounded-xl p-4 flex items-start gap-3"
                  >
                    <button
                      onClick={() => speakText(ex.en)}
                      className="p-2 hover:bg-white/10 rounded-lg transition mt-0.5 shrink-0"
                    >
                      <Volume2 size={16} className="text-accent" />
                    </button>
                    <div>
                      <p className="text-white font-medium">{ex.en}</p>
                      <p className="text-gray-400 text-sm mt-1">{ex.vi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz CTA */}
            <Link href={`/grammar/${id}/quiz`} className="block">
              <div className="glass-card p-6 text-center hover:bg-white/5 transition"
                style={{ border: "1px solid rgba(99, 102, 241, 0.4)" }}
              >
                <PenTool size={28} className="mx-auto text-primary mb-2" />
                <h3 className="text-lg font-bold text-white mb-1">
                  Làm Bài Tập
                </h3>
                <p className="text-gray-400 text-sm">
                  20 câu trắc nghiệm cho thì {tense.nameVi}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === "communication" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-3">
                🗣 {tense.name} trong giao tiếp hàng ngày
              </h3>
              <div className="space-y-4">
                {tense.usage.map((item, i) => (
                  <div key={i} className="bg-black/30 rounded-xl p-4">
                    <p className="text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-3">
                💬 Ví dụ thực tế
              </h3>
              <div className="space-y-3">
                {tense.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="bg-black/30 rounded-xl p-4 flex items-start gap-3"
                  >
                    <button
                      onClick={() => speakText(ex.en)}
                      className="p-2 hover:bg-white/10 rounded-lg transition mt-0.5 shrink-0"
                    >
                      <Volume2 size={16} className="text-accent" />
                    </button>
                    <div>
                      <p className="text-white font-medium">{ex.en}</p>
                      <p className="text-gray-400 text-sm mt-1">{ex.vi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Conversation Tab */}
        {activeTab === "conversation" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  🤖 Hội Thoại AI
                </h3>
                <button
                  onClick={() => handleGenerateConversation(!!conversation)}
                  disabled={isLoadingConversation}
                  className="btn-primary text-sm"
                >
                  {isLoadingConversation ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Đang tạo...
                    </>
                  ) : conversation ? (
                    <>
                      <RefreshCw size={16} />
                      Tạo mới
                    </>
                  ) : (
                    <>
                      <MessageSquare size={16} />
                      Tạo hội thoại
                    </>
                  )}
                </button>
              </div>

              {!conversation && !isLoadingConversation && (
                <div className="text-center py-12">
                  <MessageSquare
                    size={48}
                    className="mx-auto text-gray-500 mb-4"
                  />
                  <p className="text-gray-400 mb-2">
                    Nhấn &quot;Tạo hội thoại&quot; để Gemini AI sinh đoạn hội thoại
                  </p>
                  <p className="text-gray-500 text-sm">
                    Sử dụng thì {tense.name} trong ngữ cảnh giao tiếp thực tế
                  </p>
                </div>
              )}

              {isLoadingConversation && (
                <div className="text-center py-12">
                  <Loader2
                    size={40}
                    className="mx-auto text-primary animate-spin mb-4"
                  />
                  <p className="text-gray-400">
                    Đang tạo hội thoại với Gemini AI...
                  </p>
                </div>
              )}

              {conversation && !isLoadingConversation && (
                <div>
                  <h4 className="text-white font-medium mb-4 text-center">
                    {conversation.title}
                  </h4>
                  <div className="space-y-3">
                    {conversation.lines.map((line, i) => {
                      const isFirstSpeaker =
                        line.speaker === conversation.speakers[0];
                      return (
                        <div
                          key={i}
                          className={`flex ${isFirstSpeaker ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              isFirstSpeaker
                                ? "bg-black/40 rounded-tl-sm"
                                : "bg-primary/20 rounded-tr-sm"
                            }`}
                          >
                            <p className="text-xs text-gray-500 mb-1">
                              {line.speaker}
                            </p>
                            <p className="text-gray-200 text-sm">
                              {renderBoldText(line.text)}
                            </p>
                            <button
                              onClick={() => speakText(line.text)}
                              className="mt-1 p-1 hover:bg-white/10 rounded transition"
                            >
                              <Volume2 size={14} className="text-accent" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-center text-gray-500 text-xs mt-4">
                    Từ in <span className="text-accent font-bold">đậm</span>{" "}
                    là động từ ở thì {tense.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
