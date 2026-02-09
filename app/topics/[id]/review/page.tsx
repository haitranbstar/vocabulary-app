"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  ArrowLeft, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Trophy,
  Target,
  Zap
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

type ExerciseType = "choice" | "dictation" | "matching";

interface Question {
  word: string;
  meaning: string;
  ipa: string;
  options?: string[];
  correctAnswer: string;
}

export default function ReviewPage({ params }: PageProps) {
  const { id } = use(params);
  const topicId = id as Id<"topics">;
  
  const topic = useQuery(api.topics.getTopic, { topicId });
  const vocabulary = useQuery(api.vocabulary.getVocabularyByTopic, { topicId });

  const [exerciseType, setExerciseType] = useState<ExerciseType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [dictationInput, setDictationInput] = useState("");

  // Matching state
  const [matchingPairs, setMatchingPairs] = useState<{left: string[], right: string[], matched: Set<string>}>({
    left: [],
    right: [],
    matched: new Set()
  });
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateQuestions = useCallback((vocabs: typeof vocabulary) => {
    if (!vocabs || vocabs.length < 4) return [];
    
    const shuffled = shuffleArray(vocabs);
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    
    return selected.map((word) => {
      const otherWords = vocabs.filter(v => v._id !== word._id);
      const wrongAnswers = shuffleArray(otherWords).slice(0, 3).map(v => v.vietnameseMeaning);
      const options = shuffleArray([word.vietnameseMeaning, ...wrongAnswers]);
      
      return {
        word: word.englishWord,
        meaning: word.vietnameseMeaning,
        ipa: word.ipa,
        options,
        correctAnswer: word.vietnameseMeaning,
      };
    });
  }, []);

  const startExercise = useCallback((type: ExerciseType) => {
    setExerciseType(type);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setDictationInput("");

    if (type === "matching" && vocabulary) {
      const selected = shuffleArray(vocabulary).slice(0, Math.min(6, vocabulary.length));
      setMatchingPairs({
        left: selected.map(v => v.englishWord),
        right: shuffleArray(selected.map(v => v.vietnameseMeaning)),
        matched: new Set()
      });
    } else if (vocabulary) {
      setQuestions(generateQuestions(vocabulary));
    }
  }, [vocabulary, generateQuestions]);

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleMultipleChoiceAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === questions[currentIndex].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) setScore(score + 1);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleDictationSubmit = () => {
    const correct = dictationInput.toLowerCase().trim() === questions[currentIndex].word.toLowerCase();
    setIsCorrect(correct);
    
    if (correct) setScore(score + 1);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setDictationInput("");
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleMatchingSelect = (word: string, side: "left" | "right") => {
    if (!vocabulary) return;
    
    if (side === "left") {
      setSelectedLeft(word);
    } else if (selectedLeft) {
      // Check if match is correct
      const vocab = vocabulary.find(v => v.englishWord === selectedLeft);
      if (vocab && vocab.vietnameseMeaning === word) {
        setMatchingPairs(prev => ({
          ...prev,
          matched: new Set([...prev.matched, selectedLeft, word])
        }));
        setScore(s => s + 1);
      }
      setSelectedLeft(null);
    }
  };

  // Check if matching is complete
  useEffect(() => {
    if (exerciseType === "matching" && matchingPairs.left.length > 0) {
      const totalPairs = matchingPairs.left.length;
      const matchedPairs = matchingPairs.matched.size / 2;
      if (matchedPairs === totalPairs) {
        setTimeout(() => setShowResult(true), 500);
      }
    }
  }, [matchingPairs.matched, matchingPairs.left.length, exerciseType]);

  if (!topic || !vocabulary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (vocabulary.length < 4) {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <Link href={`/topics/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8">
            <ArrowLeft size={20} />
            Quay lại
          </Link>
          <div className="glass-card p-12">
            <p className="text-gray-400">Cần ít nhất 4 từ vựng để tạo bài tập ôn tập</p>
          </div>
        </div>
      </div>
    );
  }

  // Show result
  if (showResult) {
    const totalQuestions = exerciseType === "matching" ? matchingPairs.left.length : questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    return (
      <div className="min-h-screen p-6 md:p-12 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <Trophy className="mx-auto text-yellow-400 mb-4" size={64} />
          <h2 className="text-3xl font-bold text-white mb-2">Hoàn Thành!</h2>
          <p className="text-gray-400 mb-6">Bạn đã hoàn thành bài ôn tập</p>
          
          <div className="bg-black/30 rounded-xl p-6 mb-6">
            <p className="text-5xl font-bold text-primary mb-2">{percentage}%</p>
            <p className="text-gray-400">{score} / {totalQuestions} câu đúng</p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => startExercise(exerciseType!)} className="btn-secondary flex-1">
              <RotateCcw size={20} />
              Làm lại
            </button>
            <Link href={`/topics/${id}`} className="flex-1">
              <button className="btn-primary w-full">
                Quay lại
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show exercise type selection
  if (!exerciseType) {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <Link href={`/topics/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4">
              <ArrowLeft size={20} />
              Quay lại {topic.name}
            </Link>
            <h1 className="text-3xl font-bold text-white">Chọn Dạng Bài Tập</h1>
          </header>

          <div className="grid gap-4">
            <button
              onClick={() => startExercise("choice")}
              className="glass-card p-6 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/20 rounded-xl">
                  <Target className="text-primary" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Trắc Nghiệm</h3>
                  <p className="text-gray-400">Chọn nghĩa đúng của từ tiếng Anh</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => startExercise("dictation")}
              className="glass-card p-6 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-accent/20 rounded-xl">
                  <Volume2 className="text-accent" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Dictation</h3>
                  <p className="text-gray-400">Nghe và gõ lại từ tiếng Anh</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => startExercise("matching")}
              className="glass-card p-6 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-success/20 rounded-xl">
                  <Zap className="text-success" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Ghép Thẻ</h3>
                  <p className="text-gray-400">Ghép từ tiếng Anh với nghĩa tiếng Việt</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Multiple Choice Exercise
  if (exerciseType === "choice") {
    const currentQuestion = questions[currentIndex];
    
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Câu {currentIndex + 1} / {questions.length}</span>
              <span className="text-primary font-bold">Điểm: {score}</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </header>

          <div className="glass-card p-8 text-center mb-6">
            <button
              onClick={() => speakWord(currentQuestion.word)}
              className="mb-4 p-3 hover:bg-white/10 rounded-xl transition"
            >
              <Volume2 size={24} className="text-accent" />
            </button>
            <h2 className="text-3xl font-bold text-white mb-2">{currentQuestion.word}</h2>
            <p className="text-accent">{currentQuestion.ipa}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options?.map((option, i) => (
              <button
                key={i}
                onClick={() => handleMultipleChoiceAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-xl text-left transition ${
                  selectedAnswer === null
                    ? "bg-black/30 hover:bg-white/10 border border-white/10"
                    : option === currentQuestion.correctAnswer
                    ? "bg-success/20 border border-success"
                    : selectedAnswer === option
                    ? "bg-error/20 border border-error animate-shake"
                    : "bg-black/30 border border-white/10 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white">{option}</span>
                  {selectedAnswer !== null && option === currentQuestion.correctAnswer && (
                    <CheckCircle2 className="text-success" size={20} />
                  )}
                  {selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                    <XCircle className="text-error" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Dictation Exercise
  if (exerciseType === "dictation") {
    const currentQuestion = questions[currentIndex];
    
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Câu {currentIndex + 1} / {questions.length}</span>
              <span className="text-primary font-bold">Điểm: {score}</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </header>

          <div className="glass-card p-8 text-center mb-6">
            <p className="text-gray-400 mb-4">Nghe và gõ lại từ tiếng Anh</p>
            <button
              onClick={() => speakWord(currentQuestion.word)}
              className="p-6 bg-accent/20 rounded-full hover:bg-accent/30 transition mb-4"
            >
              <Volume2 size={48} className="text-accent" />
            </button>
            <p className="text-gray-500 text-sm">Nhấn để nghe</p>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={dictationInput}
              onChange={(e) => setDictationInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDictationSubmit()}
              placeholder="Gõ từ bạn nghe được..."
              className={`input-field text-center text-xl ${
                isCorrect === true ? "border-success animate-success" : 
                isCorrect === false ? "border-error animate-shake" : ""
              }`}
              disabled={isCorrect !== null}
              autoFocus
            />
          </div>

          {isCorrect !== null && (
            <div className={`text-center p-4 rounded-xl ${isCorrect ? "bg-success/20" : "bg-error/20"}`}>
              <p className={isCorrect ? "text-success" : "text-error"}>
                {isCorrect ? "Chính xác!" : `Sai rồi! Đáp án: ${currentQuestion.word}`}
              </p>
            </div>
          )}

          {isCorrect === null && (
            <button onClick={handleDictationSubmit} className="btn-primary w-full">
              Kiểm tra
            </button>
          )}
        </div>
      </div>
    );
  }

  // Matching Exercise
  if (exerciseType === "matching") {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Ghép các cặp từ</span>
              <span className="text-primary font-bold">Đã ghép: {matchingPairs.matched.size / 2} / {matchingPairs.left.length}</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${(matchingPairs.matched.size / 2 / matchingPairs.left.length) * 100}%` }}
              />
            </div>
          </header>

          <div className="grid grid-cols-2 gap-6">
            {/* Left column - English words */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center mb-2">Tiếng Anh</p>
              {matchingPairs.left.map((word) => (
                <button
                  key={word}
                  onClick={() => handleMatchingSelect(word, "left")}
                  disabled={matchingPairs.matched.has(word)}
                  className={`w-full p-4 rounded-xl transition ${
                    matchingPairs.matched.has(word)
                      ? "bg-success/20 border border-success opacity-50"
                      : selectedLeft === word
                      ? "bg-primary/30 border border-primary"
                      : "bg-black/30 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-white font-medium">{word}</span>
                </button>
              ))}
            </div>

            {/* Right column - Vietnamese meanings */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center mb-2">Tiếng Việt</p>
              {matchingPairs.right.map((meaning) => (
                <button
                  key={meaning}
                  onClick={() => handleMatchingSelect(meaning, "right")}
                  disabled={matchingPairs.matched.has(meaning) || !selectedLeft}
                  className={`w-full p-4 rounded-xl transition ${
                    matchingPairs.matched.has(meaning)
                      ? "bg-success/20 border border-success opacity-50"
                      : selectedLeft
                      ? "bg-black/30 border border-white/10 hover:bg-accent/20 hover:border-accent"
                      : "bg-black/30 border border-white/10 opacity-50"
                  }`}
                >
                  <span className="text-white">{meaning}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedLeft && (
            <p className="text-center text-gray-400 mt-6">
              Đã chọn: <span className="text-primary font-medium">{selectedLeft}</span> - Chọn nghĩa phù hợp
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
