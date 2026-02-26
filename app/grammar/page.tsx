"use client";

import { grammarTenses } from "@/lib/grammarData";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Target,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function GrammarPage() {
  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft size={20} />
            Trang Chủ
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl">
              <BookOpen className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Học Ngữ Pháp
              </h1>
              <p className="text-gray-400">
                Nắm vững 5 thì cơ bản trong giao tiếp tiếng Anh
              </p>
            </div>
          </div>
        </header>

        {/* Tenses Grid */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-accent" />
            Các Thì Ngữ Pháp
          </h2>
          <div className="grid gap-4">
            {grammarTenses.map((tense, index) => (
              <Link
                key={tense.id}
                href={`/grammar/${tense.id}`}
                className="glass-card p-6 hover:bg-white/5 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{tense.icon}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 font-mono">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-xl font-bold text-white">
                          {tense.name}
                        </h3>
                      </div>
                      <p className="text-accent text-sm mb-1">{tense.nameVi}</p>
                      <p className="text-gray-400 text-sm line-clamp-1">
                        {tense.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={24}
                    className="text-gray-500 group-hover:text-primary transition"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mixed Quiz CTA */}
        <section>
          <Link href="/grammar/mixed-quiz" className="block">
            <div className="glass-card p-8 text-center hover:bg-white/5 transition group"
              style={{ border: "1px solid rgba(34, 211, 238, 0.3)" }}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <Target size={28} className="text-accent" />
                <h3 className="text-2xl font-bold text-white">
                  Bài Tập Tổng Hợp
                </h3>
              </div>
              <p className="text-gray-400 mb-4">
                20 câu trắc nghiệm ngẫu nhiên từ tất cả các thì
              </p>
              <span className="btn-primary inline-flex">
                Bắt Đầu Ngay
                <ChevronRight size={18} />
              </span>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
