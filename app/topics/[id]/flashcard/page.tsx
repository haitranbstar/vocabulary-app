"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FlashcardPage({ params }: PageProps) {
  const { id } = use(params);
  const topicId = id as Id<"topics">;
  
  const topic = useQuery(api.topics.getTopic, { topicId });
  const vocabulary = useQuery(api.vocabulary.getVocabularyByTopic, { topicId });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const nextCard = () => {
    if (vocabulary && currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!topic || !vocabulary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (vocabulary.length === 0) {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <Link href={`/topics/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8">
            <ArrowLeft size={20} />
            Quay lại
          </Link>
          <div className="glass-card p-12">
            <p className="text-gray-400">Chưa có từ vựng để tạo flashcard</p>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = vocabulary[currentIndex];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link href={`/topics/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4">
            <ArrowLeft size={20} />
            Quay lại {topic.name}
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Flashcard</h1>
            <span className="text-gray-400">
              {currentIndex + 1} / {vocabulary.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / vocabulary.length) * 100}%` }}
            />
          </div>
        </header>

        {/* Flashcard */}
        <div className="flashcard-container mb-8">
          <div 
            className={`flashcard cursor-pointer ${isFlipped ? "flipped" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="flashcard-face flashcard-front">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(currentWord.englishWord);
                }}
                className="absolute top-4 right-4 p-3 hover:bg-white/10 rounded-xl transition"
              >
                <Volume2 size={24} className="text-accent" />
              </button>
              <h2 className="text-4xl font-bold text-white mb-2">{currentWord.englishWord}</h2>
              <p className="text-xl text-accent">{currentWord.ipa}</p>
              <p className="text-gray-500 mt-6 text-sm">Click để lật thẻ</p>
            </div>

            {/* Back */}
            <div className="flashcard-face flashcard-back">
              <h2 className="text-3xl font-bold text-white mb-4">{currentWord.vietnameseMeaning}</h2>
              {currentWord.example && (
                <p className="text-gray-300 italic text-center">&quot;{currentWord.example}&quot;</p>
              )}
              <p className="text-gray-500 mt-6 text-sm">Click để lật lại</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
            Trước
          </button>
          
          <button
            onClick={resetCards}
            className="p-4 hover:bg-white/10 rounded-xl transition"
            title="Bắt đầu lại"
          >
            <RotateCcw size={24} className="text-gray-400" />
          </button>

          <button
            onClick={nextCard}
            disabled={currentIndex === vocabulary.length - 1}
            className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Tiếp
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Mẹo: Nhấn Space để lật thẻ, ← → để điều hướng
        </p>
      </div>
    </div>
  );
}
