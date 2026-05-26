"use client";

import { useState } from "react";
import { Languages, ArrowRight, Copy, Check, RotateCcw } from "lucide-react";
import StreamingOutput from "@/components/StreamingOutput";
import LoadingDots from "@/components/LoadingDots";
import { cn } from "@/lib/utils";

type Direction = "tech-to-scene" | "scene-to-tech";

const DIRECTIONS = [
  {
    id: "tech-to-scene" as Direction,
    label: "技术 → 场景",
    from: "论文摘要 / 技术描述",
    to: "商业变现场景 + 用户画像",
    fromPlaceholder:
      "粘贴论文摘要或技术描述...\n\n例如：本文提出了一种基于图注意力网络的时序异常检测方法，通过动态构建实体关系图，在多变量时间序列数据中实现了 O(n log n) 复杂度的异常定位...",
    color: "from-green-600 to-emerald-500",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/5",
    textColor: "text-green-300",
    audience: "科研人员 → 产品经理",
    desc: "将学术技术翻译成商业场景、付费用户画像和变现路径",
  },
  {
    id: "scene-to-tech" as Direction,
    label: "场景 → 技术",
    from: "业务痛点 / 产品需求",
    to: "学术检索词 + 算法分类 + 开源实现",
    fromPlaceholder:
      "描述你的业务痛点或产品需求...\n\n例如：我们的电商平台有大量用户行为数据，但推荐系统总是推同类商品，用户说推荐越来越无聊，想要更有惊喜感的推荐...",
    color: "from-blue-600 to-indigo-500",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/5",
    textColor: "text-blue-300",
    audience: "产品经理 → 科研人员",
    desc: "将业务痛点翻译成学术检索词、算法分类和开源实现推荐",
  },
];

export default function TranslatorPage() {
  const [direction, setDirection] = useState<Direction>("tech-to-scene");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentDir = DIRECTIONS.find((d) => d.id === direction)!;

  const handleTranslate = async () => {
    if (!input.trim() || isLoading) return;

    setOutput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/translator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, direction }),
      });

      if (!response.ok) {
        const err = await response.json();
        setOutput(`❌ 错误：${err.error}`);
        return;
      }

      const data = await response.json();
      setOutput(data.content);
    } catch {
      setOutput("❌ 请求失败，请检查网络连接");
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

  const handleDirectionChange = (d: Direction) => {
    setDirection(d);
    setInput("");
    setOutput("");
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                学术工程双向翻译官
              </h1>
              <p className="text-gray-500 text-sm">
                打通科研人员与产品经理之间的语言壁垒
              </p>
            </div>
          </div>
        </div>

        {/* Direction Selector */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {DIRECTIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => handleDirectionChange(d.id)}
              className={cn(
                "p-5 rounded-xl border text-left transition-all",
                direction === d.id
                  ? `${d.borderColor} ${d.bgColor}`
                  : "border-[#1e1e2e] bg-[#12121a] hover:border-white/10"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r text-white",
                    d.color
                  )}
                >
                  {d.label}
                </div>
                <span className="text-gray-600 text-xs">{d.audience}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="text-gray-400">{d.from}</span>
                <ArrowRight className="w-3 h-3 flex-shrink-0" />
                <span className="text-gray-400">{d.to}</span>
              </div>
              <p className="text-xs text-gray-600">{d.desc}</p>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div className="card p-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📥 输入：{currentDir.from}
                <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentDir.fromPlaceholder}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500/50 resize-none text-sm leading-relaxed"
                rows={12}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">
                  {input.length} 字符
                </span>
                {input && (
                  <button
                    onClick={() => setInput("")}
                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    清空
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleTranslate}
              disabled={!input.trim() || isLoading}
              className={cn(
                "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2",
                input.trim() && !isLoading
                  ? `bg-gradient-to-r ${currentDir.color} hover:opacity-90`
                  : "bg-[#1e1e2e] text-gray-600 cursor-not-allowed"
              )}
            >
              <Languages className="w-5 h-5" />
              {isLoading ? "翻译中..." : `开始翻译 →`}
            </button>
          </div>

          {/* Output */}
          <div className="card p-5 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-300">
                📤 输出：{currentDir.to}
              </label>
              {output && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                    title="复制"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setOutput("")}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                    title="清空"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              {isLoading && <LoadingDots label="AI 翻译中..." />}

              {!output && !isLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl border flex items-center justify-center mb-4",
                      currentDir.borderColor,
                      currentDir.bgColor
                    )}
                  >
                    <Languages
                      className={cn("w-8 h-8", currentDir.textColor)}
                    />
                  </div>
                  <p className="text-gray-500 text-sm max-w-xs">
                    {direction === "tech-to-scene"
                      ? "粘贴论文摘要或技术描述，AI 将翻译成商业场景和用户画像"
                      : "描述你的业务痛点，AI 将翻译成学术检索词和算法推荐"}
                  </p>
                </div>
              )}

              {output && !isLoading && (
                <StreamingOutput
                  content={output}
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
