"use client";

import { use, useState, useCallback } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTenseById } from "@/lib/grammarData";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function GrammarQuizPage({ params }: PageProps) {
  const { id } = use(params);
  const tense = getTenseById(id);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const generateQuiz = useAction(api.ai.generateGrammarQuiz);

  const handleStartQuiz = useCallback(async () => {
    if (!tense) return;
    setIsLoading(true);
    setHasStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);

    try {
      const result = await generateQuiz({
        tenseName: tense.name,
        questionCount: 20,
      });
      setQuestions(result as QuizQuestion[]);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tense, generateQuiz]);

  const handleSelectAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === questions[currentIndex].correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
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

  // Result screen
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen p-6 md:p-12 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <Trophy className="mx-auto text-yellow-400 mb-4" size={64} />
          <h2 className="text-3xl font-bold text-white mb-2">Hoàn Thành!</h2>
          <p className="text-gray-400 mb-6">
            Bài tập {tense.name} ({tense.nameVi})
          </p>

          <div className="bg-black/30 rounded-xl p-6 mb-6">
            <p className="text-5xl font-bold text-primary mb-2">
              {percentage}%
            </p>
            <p className="text-gray-400">
              {score} / {questions.length} câu đúng
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={handleStartQuiz} className="btn-secondary flex-1">
              <RotateCcw size={20} />
              Làm lại
            </button>
            <Link href={`/grammar/${id}`} className="flex-1">
              <button className="btn-primary w-full">Quay lại</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading / Not started
  if (!hasStarted || isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <Link
              href={`/grammar/${id}`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
            >
              <ArrowLeft size={20} />
              Quay lại {tense.name}
            </Link>
          </header>

          <div className="glass-card p-12 text-center">
            {isLoading ? (
              <>
                <Loader2
                  size={48}
                  className="mx-auto text-primary animate-spin mb-4"
                />
                <h2 className="text-xl font-bold text-white mb-2">
                  Đang tạo bài tập...
                </h2>
                <p className="text-gray-400">
                  AI đang sinh 20 câu trắc nghiệm cho thì {tense.nameVi}
                </p>
              </>
            ) : (
              <>
                <span className="text-6xl mb-4 block">{tense.icon}</span>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Bài Tập: {tense.name}
                </h2>
                <p className="text-gray-400 mb-6">
                  20 câu trắc nghiệm - Gemini AI tạo tự động
                </p>
                <button onClick={handleStartQuiz} className="btn-primary">
                  Bắt Đầu
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  if (questions.length === 0) {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-2xl mx-auto text-center glass-card p-12">
          <p className="text-gray-400 mb-4">
            Không thể tạo bài tập. Vui lòng thử lại.
          </p>
          <button onClick={handleStartQuiz} className="btn-primary">
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <button
            onClick={() => setHasStarted(false)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft size={20} />
            Thoát bài tập
          </button>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">
              Câu {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-primary font-bold">Điểm: {score}</span>
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </header>

        {/* Question */}
        <div className="glass-card p-6 mb-6">
          <p className="text-white text-lg font-medium">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelectAnswer(i)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-xl text-left transition ${
                selectedAnswer === null
                  ? "bg-black/30 hover:bg-white/10 border border-white/10"
                  : i === currentQuestion.correctAnswer
                    ? "bg-success/20 border border-success"
                    : selectedAnswer === i
                      ? "bg-error/20 border border-error"
                      : "bg-black/30 border border-white/10 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white">{option}</span>
                {selectedAnswer !== null &&
                  i === currentQuestion.correctAnswer && (
                    <CheckCircle2 className="text-success" size={20} />
                  )}
                {selectedAnswer === i &&
                  i !== currentQuestion.correctAnswer && (
                    <XCircle className="text-error" size={20} />
                  )}
              </div>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div
            className={`p-4 rounded-xl mb-6 ${
              selectedAnswer === currentQuestion.correctAnswer
                ? "bg-success/15 border border-success/30"
                : "bg-error/15 border border-error/30"
            }`}
          >
            <p
              className={`font-medium mb-1 ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? "text-success"
                  : "text-error"
              }`}
            >
              {selectedAnswer === currentQuestion.correctAnswer
                ? "✅ Chính xác!"
                : "❌ Sai rồi!"}
            </p>
            <p className="text-gray-300 text-sm">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {selectedAnswer !== null && (
          <button onClick={handleNextQuestion} className="btn-primary w-full">
            {currentIndex < questions.length - 1
              ? "Câu Tiếp Theo"
              : "Xem Kết Quả"}
          </button>
        )}
      </div>
    </div>
  );
}
