"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StreamingOutputProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

/**
 * 将 Markdown 风格文本渲染为 HTML（轻量级，无需引入 marked 库）
 */
function renderMarkdown(text: string): string {
  return text
    // 标题
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // 粗体 / 斜体
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // 行内代码
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // 分割线
    .replace(/^---$/gm, "<hr>")
    // 无序列表
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    // 有序列表
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // 引用
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // 换行
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
}

export default function StreamingOutput({
  content,
  isStreaming = false,
  className,
}: StreamingOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 流式输出时自动滚动到底部
  useEffect(() => {
    if (isStreaming && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content, isStreaming]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "prose-dark overflow-y-auto",
        isStreaming && "streaming-cursor",
        className
      )}
      dangerouslySetInnerHTML={{
        __html: content ? `<p>${renderMarkdown(content)}</p>` : "",
      }}
    />
  );
}
