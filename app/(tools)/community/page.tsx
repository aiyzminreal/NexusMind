"use client";

import { useState } from "react";
import { Users, Lock, Shield, Lightbulb, Tag, Send, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

// 模拟社区数据（实际接入 Supabase 后替换）
const MOCK_IDEAS = [
  {
    id: "1",
    core: "将量子纠错码的冗余编码思想应用于分布式数据库的容错机制",
    tags: ["量子计算", "分布式系统", "容错"],
    domain: "计算机科学 × 量子物理",
    reviews: 7,
    timestamp: "2026-05-24",
    certified: true,
  },
  {
    id: "2",
    core: "用生态系统中的捕食者-猎物动力学模型来优化广告竞价策略",
    tags: ["生态学", "广告技术", "博弈论"],
    domain: "生物学 × 商业策略",
    reviews: 12,
    timestamp: "2026-05-23",
    certified: true,
  },
  {
    id: "3",
    core: "借鉴免疫系统的自适应识别机制设计网络安全异常检测系统",
    tags: ["免疫学", "网络安全", "自适应系统"],
    domain: "生物学 × 信息安全",
    reviews: 5,
    timestamp: "2026-05-22",
    certified: false,
  },
  {
    id: "4",
    core: "将城市交通流量的元胞自动机模型迁移到社交网络信息传播预测",
    tags: ["复杂系统", "社交网络", "传播动力学"],
    domain: "交通工程 × 社会计算",
    reviews: 9,
    timestamp: "2026-05-21",
    certified: true,
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "publish">("browse");
  const [idea, setIdea] = useState("");
  const [tags, setTags] = useState("");
  const [domain, setDomain] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [certId] = useState(
    () => `NM-${Date.now().toString(36).toUpperCase()}`
  );

  const handlePublish = () => {
    if (!idea.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">盲盒共创社区</h1>
              <p className="text-gray-500 text-sm">
                去隐私化点子发布 · 跨领域专家评议 · 创意零知识证明确权
              </p>
            </div>
          </div>
        </div>

        {/* Mechanism Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Eye,
              title: "盲盒机制",
              desc: "隐去身份和具体场景，只保留核心逻辑内核，通过标签匹配推送给不同领域专家",
              color: "text-pink-400",
              bg: "bg-pink-400/10 border-pink-400/20",
            },
            {
              icon: Shield,
              title: "零知识确权",
              desc: "数字时间戳 + 不可篡改加密凭证，生成灵感确权证书，记录技术逻辑演进全过程",
              color: "text-purple-400",
              bg: "bg-purple-400/10 border-purple-400/20",
            },
            {
              icon: Lock,
              title: "合伙保护",
              desc: "社区成员如需联合开发，必须发起合伙请求或技术授权，保护创作者热情",
              color: "text-cyan-400",
              bg: "bg-cyan-400/10 border-cyan-400/20",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={cn("card p-4 border", item.bg)}
              >
                <Icon className={cn("w-5 h-5 mb-2", item.color)} />
                <div className="font-medium text-gray-200 text-sm mb-1">
                  {item.title}
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "browse" as const, label: "浏览点子库" },
            { id: "publish" as const, label: "发布我的点子" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-pink-600/20 text-pink-300 border border-pink-500/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Browse Tab */}
        {activeTab === "browse" && (
          <div className="space-y-4">
            <p className="text-gray-600 text-xs">
              以下为去隐私化处理后的创意核心逻辑，身份信息已隐去
            </p>
            {MOCK_IDEAS.map((idea) => (
              <div
                key={idea.id}
                className="card p-5 hover:border-pink-500/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm font-medium leading-relaxed">
                        {idea.core}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="text-purple-400">{idea.domain}</span>
                      <span>·</span>
                      <span>{idea.reviews} 人评议</span>
                      <span>·</span>
                      <span>{idea.timestamp}</span>
                      {idea.certified && (
                        <>
                          <span>·</span>
                          <span className="text-green-400 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            已确权
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-[#1e1e2e] text-gray-500 text-xs flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-500 hover:text-gray-300 hover:border-pink-500/30 transition-all text-xs">
                    参与评议
                  </button>
                  <button className="px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-500 hover:text-gray-300 hover:border-purple-500/30 transition-all text-xs">
                    发起合伙请求
                  </button>
                </div>
              </div>
            ))}
            <div className="text-center py-6 text-gray-600 text-sm">
              社区功能完整版需连接 Supabase 数据库后启用
            </div>
          </div>
        )}

        {/* Publish Tab */}
        {activeTab === "publish" && (
          <div className="max-w-2xl">
            {submitted ? (
              <div className="card p-8 text-center animate-slide-up">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-500/20 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  确权证书已生成
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  你的创意已完成去隐私化处理并发布到社区
                </p>
                <div className="bg-[#0a0a0f] border border-green-500/20 rounded-xl p-4 mb-6">
                  <div className="text-xs text-gray-500 mb-1">确权证书 ID</div>
                  <div className="font-mono text-green-400 text-lg font-bold">
                    {certId}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    时间戳：{new Date().toISOString()}
                  </div>
                  <div className="text-xs text-gray-600">
                    哈希：{Math.random().toString(36).slice(2, 18).toUpperCase()}
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-4">
                  请保存此证书 ID，它是你创意优先权的唯一凭证
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setIdea("");
                    setTags("");
                    setDomain("");
                  }}
                  className="px-6 py-2.5 rounded-xl border border-[#1e1e2e] text-gray-400 hover:text-gray-200 hover:border-pink-500/30 transition-all text-sm"
                >
                  发布新点子
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="card p-4 border border-yellow-500/20 bg-yellow-500/5">
                  <p className="text-yellow-400 text-xs leading-relaxed">
                    ⚠️ 发布前，系统将自动对你的内容进行去隐私化处理：隐去身份信息和具体场景，只保留核心逻辑内核。同时生成不可篡改的数字时间戳确权证书。
                  </p>
                </div>

                <div className="card p-5">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    💡 创意核心逻辑
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="描述你的跨界创意的核心逻辑（不需要包含你的身份信息，系统会自动处理）..."
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-pink-500/50 resize-none text-sm leading-relaxed"
                    rows={5}
                  />
                </div>

                <div className="card p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      🏷️ 领域标签（用逗号分隔）
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="例如：机器学习, 生物信息学, 推荐系统"
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-pink-500/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      🔀 跨界领域描述
                    </label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="例如：计算机科学 × 神经科学"
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-pink-500/50 text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePublish}
                  disabled={!idea.trim()}
                  className={cn(
                    "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2",
                    idea.trim()
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500"
                      : "bg-[#1e1e2e] text-gray-600 cursor-not-allowed"
                  )}
                >
                  <Send className="w-5 h-5" />
                  去隐私化发布 + 生成确权证书
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
