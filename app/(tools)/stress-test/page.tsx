"use client";

import { Shield, RotateCcw } from "lucide-react";
import StreamingOutput from "@/components/StreamingOutput";
import LoadingDots from "@/components/LoadingDots";
import { cn } from "@/lib/utils";
import { useSessionState } from "@/lib/useSessionState";

interface HatResult {
  hat: string;
  color: string;
  emoji: string;
  role: string;
  content: string;
}

const HAT_COLORS: Record<string, string> = {
  white: "border-gray-400/30 bg-gray-400/5",
  red: "border-red-400/30 bg-red-400/5",
  black: "border-gray-600/50 bg-gray-900/50",
  yellow: "border-yellow-400/30 bg-yellow-400/5",
  green: "border-green-400/30 bg-green-400/5",
  blue: "border-blue-400/30 bg-blue-400/5",
};

const HAT_TEXT: Record<string, string> = {
  white: "text-gray-300",
  red: "text-red-300",
  black: "text-gray-400",
  yellow: "text-yellow-300",
  green: "text-green-300",
  blue: "text-blue-300",
};

export default function StressTestPage() {
  const [idea, setIdea] = useSessionState("stress_idea", "");
  const [context, setContext] = useSessionState("stress_context", "");
  const [results, setResults] = useSessionState<HatResult[]>("stress_results", []);
  const [isLoading, setIsLoading] = useSessionState("stress_loading", false);
  const [activeHat, setActiveHat] = useSessionState<string | null>("stress_activeHat", null);

  const handleTest = async () => {
    if (!idea.trim() || isLoading) return;

    setResults([]);
    setIsLoading(true);
    setActiveHat(null);

    try {
      const response = await fetch("/api/stress-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, context }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(`错误：${err.error}`);
        return;
      }

      const data = await response.json();
      setResults(data.results);
      if (data.results.length > 0) {
        setActiveHat(data.results[0].hat);
      }
    } catch {
      alert("请求失败，请检查网络连接");
    } finally {
      setIsLoading(false);
    }
  };

  const activeResult = results.find((r) => r.hat === activeHat);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                第一性原理断裂测试
              </h1>
              <p className="text-gray-500 text-sm">
                六顶思考帽 AI 角色，对你的跨界灵感进行最严厉的批判性分析
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                💡 你的跨界创意
                <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="例如：将强化学习中的奖励机制应用到企业绩效管理系统中，用动态奖励替代传统 KPI..."
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 resize-none text-sm leading-relaxed"
                rows={5}
              />
            </div>

            <div className="card p-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📋 背景信息（可选）
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="你的背景、已有资源、目标用户、约束条件等..."
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 resize-none text-sm leading-relaxed"
                rows={3}
              />
            </div>

            {/* Six Hats Preview */}
            <div className="card p-5">
              <p className="text-xs text-gray-500 mb-3">六顶思考帽角色</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { emoji: "🤍", hat: "白帽", role: "数据与事实" },
                  { emoji: "❤️", hat: "红帽", role: "直觉与情感" },
                  { emoji: "🖤", hat: "黑帽", role: "风险与批判" },
                  { emoji: "💛", hat: "黄帽", role: "价值与机会" },
                  { emoji: "💚", hat: "绿帽", role: "创意与变体" },
                  { emoji: "💙", hat: "蓝帽", role: "元认知协调" },
                ].map((h) => (
                  <div
                    key={h.hat}
                    className="flex items-center gap-2 text-xs text-gray-500"
                  >
                    <span>{h.emoji}</span>
                    <span>
                      {h.hat} · {h.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleTest}
              disabled={!idea.trim() || isLoading}
              className={cn(
                "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2",
                idea.trim() && !isLoading
                  ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
                  : "bg-[#1e1e2e] text-gray-600 cursor-not-allowed"
              )}
            >
              <Shield className="w-5 h-5" />
              {isLoading ? "六帽分析中（约30秒）..." : "启动断裂测试"}
            </button>

            {results.length > 0 && (
              <button
                onClick={() => {
                  setResults([]);
                  setActiveHat(null);
                }}
                className="w-full py-3 rounded-xl border border-[#1e1e2e] text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                重新测试
              </button>
            )}
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-3">
            {isLoading && (
              <div className="card p-8 flex flex-col items-center justify-center min-h-[400px]">
                <LoadingDots label="六顶思考帽同步分析中，请稍候..." />
                <p className="text-gray-600 text-xs mt-4 text-center">
                  正在并行调用 6 个 AI 角色进行深度分析
                  <br />
                  通常需要 20-40 秒
                </p>
              </div>
            )}

            {!isLoading && results.length === 0 && (
              <div className="card p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/20 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-gray-500 text-sm max-w-xs">
                  输入你的跨界创意，
                  <br />
                  六顶思考帽将从不同维度进行深度分析
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-4">
                {/* Hat Tabs */}
                <div className="flex flex-wrap gap-2">
                  {results.map((r) => (
                    <button
                      key={r.hat}
                      onClick={() => setActiveHat(r.hat)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                        activeHat === r.hat
                          ? HAT_COLORS[r.color] + " " + HAT_TEXT[r.color]
                          : "border-[#1e1e2e] text-gray-500 hover:text-gray-300"
                      )}
                    >
                      {r.emoji} {r.hat}帽
                    </button>
                  ))}
                </div>

                {/* Active Hat Content */}
                {activeResult && (
                  <div
                    className={cn(
                      "card p-6 border animate-fade-in",
                      HAT_COLORS[activeResult.color]
                    )}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{activeResult.emoji}</span>
                      <div>
                        <div
                          className={cn(
                            "font-semibold",
                            HAT_TEXT[activeResult.color]
                          )}
                        >
                          {activeResult.hat}帽 · {activeResult.role}
                        </div>
                      </div>
                    </div>
                    <StreamingOutput
                      content={activeResult.content}
                      className="max-h-[500px] overflow-y-auto"
                    />
                  </div>
                )}

                {/* Quick Nav */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>共 {results.length} 个视角分析完成</span>
                  <div className="flex gap-2">
                    {results.map((r, i) => (
                      <button
                        key={r.hat}
                        onClick={() => setActiveHat(r.hat)}
                        className={cn(
                          "w-6 h-6 rounded-full text-xs transition-all",
                          activeHat === r.hat
                            ? "bg-purple-600 text-white"
                            : "bg-[#1e1e2e] text-gray-500 hover:bg-[#2d2d3d]"
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
