"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TopicCard from "@/components/TopicCard";
import TopicForm from "@/components/TopicForm";
import { Plus, BookOpen, Sparkles } from "lucide-react";

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const topics = useQuery(api.topics.getTopics);
  const deleteTopic = useMutation(api.topics.deleteTopic);

  // Đếm số từ vựng của mỗi topic
  const vocabularyCounts = useQuery(api.vocabulary.getVocabularyByTopic, 
    topics?.[0] ? { topicId: topics[0]._id } : "skip"
  );

  const handleDelete = async (topicId: Id<"topics">) => {
    if (confirm("Bạn có chắc muốn xóa chủ đề này? Tất cả từ vựng sẽ bị xóa.")) {
      await deleteTopic({ topicId });
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl">
              <BookOpen className="text-white" size={36} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">VocabMaster</h1>
              <p className="text-gray-400">Học từ vựng tiếng Anh hiệu quả</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={20} />
            Tạo Chủ Đề
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <BookOpen className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{topics?.length || 0}</p>
              <p className="text-gray-400">Chủ Đề</p>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-xl">
              <Sparkles className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-gray-400">Từ Đã Học</p>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="p-3 bg-success/20 rounded-xl">
              <BookOpen className="text-success" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0%</p>
              <p className="text-gray-400">Tiến Độ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Chủ Đề Của Bạn</h2>
        
        {topics === undefined ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-400 mt-4">Đang tải...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <BookOpen className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-xl font-medium text-gray-300 mb-2">Chưa có chủ đề nào</h3>
            <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo chủ đề mới và upload từ vựng</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={20} />
              Tạo Chủ Đề Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard
                key={topic._id}
                topic={topic}
                vocabularyCount={topic.vocabularyCount || 0}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* Topic Form Modal */}
      {showForm && (
        <TopicForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
