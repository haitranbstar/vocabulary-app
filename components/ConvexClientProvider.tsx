"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Kiểm tra biến môi trường và cung cấp giá trị dự phòng để tránh crash lúc build
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl && process.env.NODE_ENV === "production") {
  console.warn("Cảnh báo: NEXT_PUBLIC_CONVEX_URL chưa được thiết lập!");
}

// Nếu convexUrl undefined, dùng một chuỗi tạm để build không bị văng lỗi No address provided
const convex = new ConvexReactClient(convexUrl ?? "https://first-dachshund-700.convex.cloud");

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}