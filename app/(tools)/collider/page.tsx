"use client";

import { useState, useRef } from "react";
import { GitMerge, Zap, RotateCcw, Copy, Check } from "lucide-react";
import StreamingOutput from "@/components/StreamingOutput";
import LoadingDots from "@/components/LoadingDots";
import { cn } from "@/lib/utils";

const SPAN_LABELS: Record<number, { label: string; example: string }> = {
  1: { label: "同细分领域", example: "React → Vue" },
  2: { label: "行业上下游", example: "前端 → 浏览器协议" },
  3: { label: "相邻行业", example: "软件 → 系统架构" },
  4: { label: "同大类跨行业", example: "IT → 电信" },
  5: { label: "技术交叉领域", example: "IT → 生物信息学" },
  6: { label: "方法论共性", example: "计算机 → 认知科学" },
  7: { label: "结构相似性", example: "算法 → 博弈论" },
  8: { label: "跨自然/社会科学", example: "数学 → 社会学" },
  9: { label: "跨理工/人文", example: "工程学 → 音乐理论" },
  10: { label: "底层科学对撞", example: "GIS → 遗传学" },
};

export default function ColliderPage() {
  const [domain, setDomain] = useState("");
  const [problem, setProblem] = useState("");
  const [crossSpan, setCrossSpan] = useState(5);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleCollide = async () => {
    if (!domain.trim() || isLoading) return;

    setOutput("");
    setIsLoading(true);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/collider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, problem, crossSpan }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const err = await response.json();
        setOutput(`❌ 错误：${err.error}`);
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setOutput((prev) => prev + parsed.content);
              }
            } catch {
              // ignore
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setOutput("❌ 请求失败，请检查网络连接");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setOutput("");
    setIsLoading(false);
  };

  const spanInfo = SPAN_LABELS[crossSpan];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center">
              <GitMerge className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                多维知识图谱对撞
              </h1>
              <p className="text-gray-500 text-sm">
                发现跨领域的底层结构共性，找到技术转移桥梁路径
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-5">
            {/* Domain Input */}
            <div className="card p-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🎯 我的核心领域 / 当前问题
                <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="例如：我在研究图神经网络在推荐系统中的应用，想找到新的突破方向..."
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 resize-none text-sm leading-relaxed"
                rows={4}
              />
            </div>

            {/* Optional Problem */}
            <div className="card p-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                💬 具体问题或场景（可选）
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="例如：目前遇到的瓶颈是冷启动问题，想看看其他领域有没有类似的解法..."
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 resize-none text-sm leading-relaxed"
                rows={3}
              />
            </div>

            {/* Cross Span Slider */}
            <div className="card p-5">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                ⚡ 跨界跨度
              </label>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">保守</span>
                  <div className="text-center">
                    <span className="text-2xl font-bold gradient-text">
                      {crossSpan}
                    </span>
                    <span className="text-gray-500 text-sm"> / 10</span>
                  </div>
                  <span className="text-xs text-gray-500">极限</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={crossSpan}
                  onChange={(e) => setCrossSpan(Number(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, #7c3aed ${(crossSpan - 1) * 11.1}%, #1e1e2e ${(crossSpan - 1) * 11.1}%)`,
                  }}
                />
              </div>

              <div className="bg-[#0a0a0f] rounded-lg p-3 border border-[#1e1e2e]">
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 font-medium text-sm">
                    {spanInfo.label}
                  </span>
                  <span className="text-gray-500 text-xs">
                    示例：{spanInfo.example}
                  </span>
                </div>
              </div>

              {/* Span scale */}
              <div className="mt-3 grid grid-cols-5 gap-1">
                {[1, 3, 5, 7, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCrossSpan(n)}
                    className={cn(
                      "text-xs py-1 rounded transition-all",
                      crossSpan === n
                        ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                        : "text-gray-600 hover:text-gray-400"
                    )}
                  >
                    {n}档
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCollide}
              disabled={!domain.trim() || isLoading}
              className={cn(
                "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2",
                domain.trim() && !isLoading
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 glow-purple"
                  : "bg-[#1e1e2e] text-gray-600 cursor-not-allowed"
              )}
            >
              <Zap className="w-5 h-5" />
              {isLoading ? "对撞中..." : "启动知识对撞"}
            </button>
          </div>

          {/* Output Panel */}
          <div className="card p-5 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-300">
                📊 对撞报告
              </h2>
              <div className="flex items-center gap-2">
                {output && (
                  <>
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                      title="复制报告"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                      title="清空"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {isLoading && !output && <LoadingDots label="知识图谱对撞中..." />}

              {!output && !isLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-violet-500/20 border border-purple-500/20 flex items-center justify-center mb-4">
                    <GitMerge className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-gray-500 text-sm max-w-xs">
                    输入你的领域和问题，调整跨度档位，
                    <br />
                    启动知识对撞后报告将在这里实时生成
                  </p>
                </div>
              )}

              {output && (
                <StreamingOutput
                  content={output}
                  isStreaming={isLoading}
                  className="h-full max-h-[600px]"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
