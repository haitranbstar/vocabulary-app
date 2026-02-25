"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  ArrowLeft, 
  BookOpen, 
  Layers, 
  Play, 
  GraduationCap,
  Volume2,
  Pencil,
  Trash2,
  X,
  Save
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Vocabulary {
  _id: Id<"vocabulary">;
  englishWord: string;
  vietnameseMeaning: string;
  ipa: string;
  example?: string;
}

export default function TopicDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const topicId = id as Id<"topics">;
  
  const topic = useQuery(api.topics.getTopic, { topicId });
  const vocabulary = useQuery(api.vocabulary.getVocabularyByTopic, { topicId });
  const deleteVocabulary = useMutation(api.vocabulary.deleteVocabulary);
  const updateVocabulary = useMutation(api.vocabulary.updateVocabulary);

  const [selectedWord, setSelectedWord] = useState<Vocabulary | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    englishWord: "",
    vietnameseMeaning: "",
    ipa: "",
    example: "",
  });

  const [aiExamples, setAiExamples] = useState<Record<string, string[]>>({});
  const [isAiLoading, setIsAiLoading] = useState(false);

  const generateAIExamples = useAction(api.ai.generateExamples);

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleSelectWord = (word: Vocabulary) => {
    setSelectedWord(word);
    setEditForm({
      englishWord: word.englishWord,
      vietnameseMeaning: word.vietnameseMeaning,
      ipa: word.ipa,
      example: word.example || "",
    });
    setIsEditing(false);

    // Fetch AI examples if not already loaded
    if (!aiExamples[word._id]) {
      fetchAIExamples(word.englishWord, word._id);
    }
  };

  const fetchAIExamples = async (word: string, vocabId: string) => {
    setIsAiLoading(true);
    try {
      const examples = await generateAIExamples({ word });
      setAiExamples(prev => ({ ...prev, [vocabId]: examples }));
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDelete = async (vocabId: Id<"vocabulary">) => {
    if (confirm("Bạn có chắc muốn xóa từ này?")) {
      await deleteVocabulary({ vocabularyId: vocabId });
      setSelectedWord(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedWord) return;
    await updateVocabulary({
      vocabularyId: selectedWord._id,
      ...editForm,
    });
    setIsEditing(false);
    // Update local state
    setSelectedWord({
      ...selectedWord,
      ...editForm,
    });
  };


  if (!topic || !vocabulary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6">
          <ArrowLeft size={20} />
          Quay lại
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{topic.name}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-2">
                <Layers size={18} />
                {vocabulary?.length || 0} từ vựng
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href={`/topics/${id}/flashcard`}>
              <button className="btn-secondary">
                <Play size={20} />
                Flashcard
              </button>
            </Link>
            <Link href={`/topics/${id}/review`}>
              <button className="btn-primary">
                <GraduationCap size={20} />
                Ôn Tập
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vocabulary List */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen size={24} />
              Danh Sách Từ Vựng
            </h2>

            {vocabulary.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Chưa có từ vựng nào</p>
            ) : (
              <div className="space-y-2">
                {vocabulary.map((word) => (
                  <div
                    key={word._id}
                    onClick={() => handleSelectWord(word)}
                    className={`vocab-item p-4 rounded-xl cursor-pointer flex items-center justify-between ${
                      selectedWord?._id === word._id ? "bg-primary/20 border border-primary/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(word.englishWord);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                      >
                        <Volume2 size={18} className="text-accent" />
                      </button>
                      <div>
                        <p className="font-medium text-white">{word.englishWord}</p>
                        <p className="text-sm text-gray-400">{word.vietnameseMeaning}</p>
                      </div>
                    </div>
                    <span className="text-accent text-sm">{word.ipa}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Word Detail Panel */}
        <div className="lg:col-span-1">
          {selectedWord ? (
            <div className="glass-card p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Chi Tiết Từ Vựng</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <Pencil size={18} className="text-primary" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedWord._id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <Trash2 size={18} className="text-error" />
                  </button>
                  <button
                    onClick={() => setSelectedWord(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">English Word</label>
                    <input
                      className="input-field mt-1"
                      value={editForm.englishWord}
                      onChange={(e) => setEditForm({ ...editForm, englishWord: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Vietnamese Meaning</label>
                    <input
                      className="input-field mt-1"
                      value={editForm.vietnameseMeaning}
                      onChange={(e) => setEditForm({ ...editForm, vietnameseMeaning: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">IPA</label>
                    <input
                      className="input-field mt-1"
                      value={editForm.ipa}
                      onChange={(e) => setEditForm({ ...editForm, ipa: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Example</label>
                    <input
                      className="input-field mt-1"
                      value={editForm.example}
                      onChange={(e) => setEditForm({ ...editForm, example: e.target.value })}
                    />
                  </div>
                  <button onClick={handleSaveEdit} className="btn-primary w-full">
                    <Save size={18} />
                    Lưu Thay Đổi
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <button
                      onClick={() => speakWord(selectedWord.englishWord)}
                      className="mb-4 p-4 bg-primary/20 rounded-full hover:bg-primary/30 transition"
                    >
                      <Volume2 size={32} className="text-primary" />
                    </button>
                    <h2 className="text-2xl font-bold text-white">{selectedWord.englishWord}</h2>
                    <p className="text-accent text-lg">{selectedWord.ipa}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-black/30 rounded-xl">
                      <p className="text-sm text-gray-400 mb-1">Nghĩa Tiếng Việt</p>
                      <p className="text-white text-lg">{selectedWord.vietnameseMeaning}</p>
                    </div>

                    {selectedWord.example && (
                      <div className="p-4 bg-black/30 rounded-xl">
                        <p className="text-sm text-gray-400 mb-1">Ví Dụ</p>
                        <p className="text-white italic">&quot;{selectedWord.example}&quot;</p>
                      </div>
                    )}

                    <div className="p-4 bg-black/30 rounded-xl">
                      <p className="text-sm text-gray-400 mb-2">Giao Tiếp Hàng Ngày (AI)</p>
                      {isAiLoading ? (
                        <div className="flex items-center gap-2 py-2">
                          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          <p className="text-xs text-gray-500">Đang sinh câu ví dụ...</p>
                        </div>
                      ) : (
                        <ul className="space-y-2">
                          {(aiExamples[selectedWord._id] || []).map((ex, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-accent">•</span>
                              {ex}
                            </li>
                          ))}
                          {!isAiLoading && !aiExamples[selectedWord._id] && (
                            <li className="text-sm text-gray-500 italic">Không có ví dụ</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="glass-card p-6 text-center">
              <BookOpen className="mx-auto text-gray-500 mb-4" size={40} />
              <p className="text-gray-400">Chọn một từ để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
