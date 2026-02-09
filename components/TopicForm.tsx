"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import * as XLSX from "xlsx";
import { Upload, X, FileSpreadsheet, Save, AlertCircle } from "lucide-react";

interface VocabularyRow {
  englishWord: string;
  vietnameseMeaning: string;
  ipa: string;
  example?: string;
}

interface TopicFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TopicForm({ onClose, onSuccess }: TopicFormProps) {
  const [topicName, setTopicName] = useState("");
  const [vocabularyData, setVocabularyData] = useState<VocabularyRow[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createTopic = useMutation(api.topics.createTopic);
  const bulkCreateVocabulary = useMutation(api.vocabulary.bulkCreateVocabulary);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

        // Skip header row, parse data
        const parsedData: VocabularyRow[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row[0] && row[1] && row[2]) {
            parsedData.push({
              englishWord: String(row[0]).trim(),
              vietnameseMeaning: String(row[1]).trim(),
              ipa: String(row[2]).trim(),
              example: row[3] ? String(row[3]).trim() : undefined,
            });
          }
        }

        if (parsedData.length === 0) {
          setError("File không có dữ liệu hợp lệ. Cần có 3 cột: English Word, Vietnamese Meaning, IPA");
          return;
        }

        setVocabularyData(parsedData);
      } catch {
        setError("Lỗi đọc file Excel. Vui lòng kiểm tra định dạng file.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleSave = async () => {
    if (!topicName.trim()) {
      setError("Vui lòng nhập tên chủ đề");
      return;
    }

    if (vocabularyData.length === 0) {
      setError("Vui lòng upload file từ vựng");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Tạo topic
      const topicId = await createTopic({ name: topicName.trim() });
      
      // Thêm vocabulary
      await bulkCreateVocabulary({
        topicId: topicId as Id<"topics">,
        words: vocabularyData,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Tạo Chủ Đề Mới</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Topic Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tên Chủ Đề (Tiếng Anh)
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Ví dụ: Business, Travel, Technology..."
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
          />
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload File Từ Vựng (.xlsx, .xls)
          </label>
          <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/50 transition">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto mb-3 text-primary" size={40} />
              <p className="text-gray-400">
                Kéo thả file hoặc <span className="text-primary">chọn file</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Cấu trúc: English Word | Vietnamese Meaning | IPA | Example (tùy chọn)
              </p>
            </label>
          </div>
        </div>

        {/* Preview */}
        {vocabularyData.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet className="text-success" size={20} />
              <span className="text-success font-medium">
                Đã tải {vocabularyData.length} từ vựng
              </span>
            </div>
            <div className="bg-black/30 rounded-lg p-4 max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="text-left py-2">English</th>
                    <th className="text-left py-2">Vietnamese</th>
                    <th className="text-left py-2">IPA</th>
                  </tr>
                </thead>
                <tbody>
                  {vocabularyData.slice(0, 5).map((word, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 text-white">{word.englishWord}</td>
                      <td className="py-2 text-gray-300">{word.vietnameseMeaning}</td>
                      <td className="py-2 text-accent">{word.ipa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vocabularyData.length > 5 && (
                <p className="text-gray-500 text-center mt-2">
                  ... và {vocabularyData.length - 5} từ khác
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isLoading ? "Đang lưu..." : "Lưu Chủ Đề"}
          </button>
        </div>
      </div>
    </div>
  );
}
