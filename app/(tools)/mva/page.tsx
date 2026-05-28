"use client";

import { Cpu, FileCode, Layers, Database, Copy, Check, RotateCcw } from "lucide-react";
import StreamingOutput from "@/components/StreamingOutput";
import LoadingDots from "@/components/LoadingDots";
import { cn } from "@/lib/utils";
import { useSessionState } from "@/lib/useSessionState";

type TabType = "overview" | "prompt" | "stack" | "mockdata";

const TABS: { id: TabType; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "overview", label: "MVA 概览", icon: Layers, desc: "技术拓扑图 + 验证路径 + 风险矩阵" },
  { id: "prompt", label: "System Prompt", icon: FileCode, desc: "一键生成可直接运行的 MVP 提示词" },
  { id: "stack", label: "研发栈推荐", icon: Cpu, desc: "技术选型 + 成本估算 + 部署步骤" },
  { id: "mockdata", label: "模拟数据集", icon: Database, desc: "符合业务逻辑的 Mock 数据 + Python 代码" },
];

export default function MVAPage() {
  const [idea, setIdea] = useSessionState("mva_idea", "");
  const [domain, setDomain] = useSessionState("mva_domain", "");
  const [targetUser, setTargetUser] = useSessionState("mva_targetUser", "");
  const [activeTab, setActiveTab] = useSessionState<TabType>("mva_activeTab", "overview");
  const [outputs, setOutputs] = useSessionState<Partial<Record<TabType, string>>>("mva_outputs", {});
  const [loadingTab, setLoadingTab] = useSessionState<TabType | null>("mva_loadingTab", null);
  const [copied, setCopied] = useSessionState("mva_copied", false);

  const handleGenerate = async (type: TabType) => {
    if (!idea.trim() || loadingTab) return;

    setLoadingTab(type);
    setActiveTab(type);

    try {
      const response = await fetch("/api/mva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, domain, targetUser, type }),
      });

      if (!response.ok) {
        const err = await response.json();
        setOutputs((prev) => ({ ...prev, [type]: `❌ 错误：${err.error}` }));
        return;
      }

      const data = await response.json();
      setOutputs((prev) => ({ ...prev, [type]: data.content }));
    } catch {
      setOutputs((prev) => ({ ...prev, [type]: "❌ 请求失败，请检查网络连接" }));
    } finally {
      setLoadingTab(null);
    }
  };

  const handleCopy = async () => {
    const content = outputs[activeTab];
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeOutput = outputs[activeTab];
  const isActiveLoading = loadingTab === activeTab;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-500 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                MVA 动态生成器
              </h1>
              <p className="text-gray-500 text-sm">
                最小可行性架构 · 一键生成技术拓扑、System Prompt、研发栈推荐和模拟数据
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                💡 创意描述
                <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="例如：用 AI 分析用户的代码提交历史，自动生成个性化的技术成长路径和学习建议..."
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 resize-none text-sm leading-relaxed"
                rows={5}
              />
            </div>

            <div className="card p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🔧 技术领域（可选）
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="例如：Web 全栈、移动端、数据分析..."
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  👥 目标用户（可选）
                </label>
                <input
                  type="text"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  placeholder="例如：初级开发者、科研人员、产品经理..."
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 text-sm"
                />
              </div>
            </div>

            {/* Generate Buttons */}
            <div className="space-y-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isLoading = loadingTab === tab.id;
                const isDone = !!outputs[tab.id];
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isDone) {
                        setActiveTab(tab.id);
                      } else {
                        handleGenerate(tab.id);
                      }
                    }}
                    disabled={!idea.trim() || (!!loadingTab && !isLoading)}
                    className={cn(
                      "w-full p-3 rounded-xl border text-left transition-all",
                      isDone
                        ? "border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10"
                        : idea.trim() && !loadingTab
                        ? "border-[#1e1e2e] bg-[#12121a] hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        : "border-[#1e1e2e] bg-[#0a0a0f] opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4 flex-shrink-0",
                          isDone ? "text-cyan-400" : "text-gray-500"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "text-sm font-medium",
                            isDone ? "text-cyan-300" : "text-gray-300"
                          )}
                        >
                          {isLoading ? "生成中..." : tab.label}
                          {isDone && (
                            <span className="ml-2 text-xs text-cyan-500">
                              ✓ 已生成
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {tab.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-3">
            {/* Tab Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2 flex-wrap">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => outputs[tab.id] && setActiveTab(tab.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30"
                        : outputs[tab.id]
                        ? "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                        : "text-gray-700 cursor-not-allowed"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {activeOutput && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                    title="复制内容"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      setOutputs((prev) => {
                        const next = { ...prev };
                        delete next[activeTab];
                        return next;
                      })
                    }
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                    title="重新生成"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="card p-5 min-h-[500px] flex flex-col">
              {isActiveLoading && (
                <LoadingDots label={`${TABS.find((t) => t.id === activeTab)?.label} 生成中...`} />
              )}

              {!isActiveLoading && !activeOutput && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center mb-4">
                    <Cpu className="w-8 h-8 text-cyan-400" />
                  </div>
                  <p className="text-gray-500 text-sm max-w-xs">
                    输入创意描述后，
                    <br />
                    点击左侧按钮生成对应内容
                  </p>
                  <p className="text-gray-600 text-xs mt-3">
                    可以同时生成多个模块，独立查看
                  </p>
                </div>
              )}

              {!isActiveLoading && activeOutput && (
                <StreamingOutput
                  content={activeOutput}
                  className="flex-1 max-h-[600px] overflow-y-auto"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
