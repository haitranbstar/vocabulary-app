import { Id } from "@/convex/_generated/dataModel";
import { BookOpen, Layers, Trash2 } from "lucide-react";
import Link from "next/link";

interface Topic {
  _id: Id<"topics">;
  name: string;
  createdAt: number;
}

interface TopicCardProps {
  topic: Topic;
  vocabularyCount: number;
  onDelete: (id: Id<"topics">) => void;
}

export default function TopicCard({ topic, vocabularyCount, onDelete }: TopicCardProps) {
  return (
    <div className="glass-card topic-card p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary/20 rounded-xl">
          <BookOpen className="text-primary" size={28} />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(topic._id);
          }}
          className="opacity-0 group-hover:opacity-100 transition btn-danger p-2"
          title="Xóa chủ đề"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{topic.name}</h3>
      
      <div className="flex items-center gap-2 text-gray-400 mb-4">
        <Layers size={16} />
        <span>{vocabularyCount} từ vựng</span>
      </div>

      <Link href={`/topics/${topic._id}`}>
        <button className="w-full btn-secondary">
          Học ngay
        </button>
      </Link>
    </div>
  );
}
