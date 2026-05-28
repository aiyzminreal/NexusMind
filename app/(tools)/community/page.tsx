"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Lock,
  Shield,
  Lightbulb,
  Tag,
  Send,
  Eye,
  MessageSquare,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Idea {
  id: string;
  core_logic: string;
  tags: string[];
  domain_cross: string | null;
  cert_id: string;
  reviews_count: number;
  created_at: string;
}

interface Review {
  id: string;
  reviewer_domain: string;
  content: string;
  created_at: string;
}

interface PublishResult {
  id: string;
  cert_id: string;
  cert_hash: string;
  created_at: string;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "publish">("browse");

  // 浏览状态
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [ideasError, setIdeasError] = useState("");

  // 评议弹窗状态
  const [reviewingIdea, setReviewingIdea] = useState<Idea | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewerDomain, setReviewerDomain] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // 发布状态
  const [idea, setIdea] = useState("");
  const [tags, setTags] = useState("");
  const [domain, setDomain] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [publishError, setPublishError] = useState("");

  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  // 加载点子列表
  const loadIdeas = useCallback(async (p: number) => {
    setLoadingIdeas(true);
    setIdeasError("");
    try {
      const res = await fetch(`/api/community?page=${p}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "加载失败");
      setIdeas(data.ideas || []);
      setTotal(data.total || 0);
    } catch (e) {
      setIdeasError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoadingIdeas(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "browse") {
      loadIdeas(page);
    }
  }, [activeTab, page, loadIdeas]);

  // 打开评议弹窗
  const openReviews = async (idea: Idea) => {
    setReviewingIdea(idea);
    setReviews([]);
    setReviewContent("");
    setReviewerDomain("");
    setReviewSuccess(false);
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/community/reviews?idea_id=${idea.id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      // 静默失败
    } finally {
      setLoadingReviews(false);
    }
  };

  // 提交评议
  const submitReview = async () => {
    if (!reviewContent.trim() || !reviewingIdea) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/community/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea_id: reviewingIdea.id,
          reviewer_domain: reviewerDomain,
          content: reviewContent,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      setReviewSuccess(true);
      setReviewContent("");
      // 刷新评议列表
      const res2 = await fetch(`/api/community/reviews?idea_id=${reviewingIdea.id}`);
      const data2 = await res2.json();
      setReviews(data2.reviews || []);
      // 更新列表中的评议数
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === reviewingIdea.id
            ? { ...i, reviews_count: i.reviews_count + 1 }
            : i
        )
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "提交失败");
    } finally {
      setSubmittingReview(false);
    }
  };

  // 发布点子
  const handlePublish = async () => {
    if (!idea.trim()) return;
    setSubmitting(true);
    setPublishError("");
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          core_logic: idea,
          tags,
          domain_cross: domain,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "发布失败");
      setPublishResult(data);
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : "发布失败");
    } finally {
      setSubmitting(false);
    }
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
              <div key={item.title} className={cn("card p-4 border", item.bg)}>
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
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-xs">
                以下为去隐私化处理后的创意核心逻辑，身份信息已隐去
                {total > 0 && (
                  <span className="ml-2 text-gray-500">共 {total} 条</span>
                )}
              </p>
              <button
                onClick={() => loadIdeas(page)}
                className="p-1.5 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-all"
                title="刷新"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", loadingIdeas && "animate-spin")} />
              </button>
            </div>

            {loadingIdeas && (
              <div className="text-center py-12 text-gray-500 text-sm">
                加载中...
              </div>
            )}

            {ideasError && (
              <div className="card p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
                ❌ {ideasError}
              </div>
            )}

            {!loadingIdeas && !ideasError && ideas.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                还没有点子，来发布第一个吧 →
              </div>
            )}

            {ideas.map((item) => (
              <div
                key={item.id}
                className="card p-5 hover:border-pink-500/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm font-medium leading-relaxed">
                        {item.core_logic}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                      {item.domain_cross && (
                        <>
                          <span className="text-purple-400">{item.domain_cross}</span>
                          <span>·</span>
                        </>
                      )}
                      <span>{item.reviews_count} 人评议</span>
                      <span>·</span>
                      <span>{new Date(item.created_at).toLocaleDateString("zh-CN")}</span>
                      <span>·</span>
                      <span className="text-green-400 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        已确权 {item.cert_id}
                      </span>
                    </div>
                  </div>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-[#1e1e2e] text-gray-500 text-xs flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openReviews(item)}
                    className="px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-500 hover:text-gray-300 hover:border-pink-500/30 transition-all text-xs flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3 h-3" />
                    参与评议
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-[#1e1e2e] text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-gray-500 text-sm">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-[#1e1e2e] text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Publish Tab */}
        {activeTab === "publish" && (
          <div className="max-w-2xl">
            {publishResult ? (
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
                <div className="bg-[#0a0a0f] border border-green-500/20 rounded-xl p-4 mb-6 text-left">
                  <div className="text-xs text-gray-500 mb-1">确权证书 ID</div>
                  <div className="font-mono text-green-400 text-lg font-bold break-all">
                    {publishResult.cert_id}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    时间戳：{new Date(publishResult.created_at).toISOString()}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    哈希：{publishResult.cert_hash}
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-4">
                  请保存此证书 ID，它是你创意优先权的唯一凭证
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setPublishResult(null);
                      setIdea("");
                      setTags("");
                      setDomain("");
                    }}
                    className="px-6 py-2.5 rounded-xl border border-[#1e1e2e] text-gray-400 hover:text-gray-200 hover:border-pink-500/30 transition-all text-sm"
                  >
                    发布新点子
                  </button>
                  <button
                    onClick={() => {
                      setPublishResult(null);
                      setIdea("");
                      setTags("");
                      setDomain("");
                      setActiveTab("browse");
                      setPage(1);
                      loadIdeas(1);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-pink-600/20 text-pink-300 border border-pink-500/30 hover:bg-pink-600/30 transition-all text-sm"
                  >
                    查看社区
                  </button>
                </div>
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

                {publishError && (
                  <div className="card p-3 border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
                    ❌ {publishError}
                  </div>
                )}

                <button
                  onClick={handlePublish}
                  disabled={!idea.trim() || submitting}
                  className={cn(
                    "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2",
                    idea.trim() && !submitting
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500"
                      : "bg-[#1e1e2e] text-gray-600 cursor-not-allowed"
                  )}
                >
                  <Send className="w-5 h-5" />
                  {submitting ? "发布中..." : "去隐私化发布 + 生成确权证书"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 评议弹窗 */}
      {reviewingIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-lg max-h-[80vh] flex flex-col border border-pink-500/20 animate-slide-up">
            {/* 弹窗头部 */}
            <div className="flex items-start justify-between p-5 border-b border-[#1e1e2e]">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-medium text-gray-200">参与评议</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {reviewingIdea.core_logic}
                </p>
              </div>
              <button
                onClick={() => setReviewingIdea(null)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 已有评议 */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {loadingReviews && (
                <p className="text-gray-500 text-sm text-center py-4">加载评议中...</p>
              )}
              {!loadingReviews && reviews.length === 0 && (
                <p className="text-gray-600 text-sm text-center py-4">
                  还没有评议，来第一个发表看法吧
                </p>
              )}
              {reviews.map((r) => (
                <div key={r.id} className="bg-[#0a0a0f] rounded-lg p-3 border border-[#1e1e2e]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-purple-400 font-medium">
                      {r.reviewer_domain || "匿名"}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(r.created_at).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{r.content}</p>
                </div>
              ))}
            </div>

            {/* 提交评议 */}
            <div className="p-5 border-t border-[#1e1e2e] space-y-3">
              {reviewSuccess && (
                <p className="text-green-400 text-xs text-center">✓ 评议已提交</p>
              )}
              <input
                type="text"
                value={reviewerDomain}
                onChange={(e) => setReviewerDomain(e.target.value)}
                placeholder="你的领域（可选，如：机器学习研究者）"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-pink-500/50 text-sm"
              />
              <div className="flex gap-2">
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="写下你的评议..."
                  className="flex-1 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-pink-500/50 resize-none text-sm"
                  rows={2}
                />
                <button
                  onClick={submitReview}
                  disabled={!reviewContent.trim() || submittingReview}
                  className={cn(
                    "px-4 rounded-lg font-medium text-sm transition-all flex-shrink-0",
                    reviewContent.trim() && !submittingReview
                      ? "bg-pink-600 text-white hover:bg-pink-500"
                      : "bg-[#1e1e2e] text-gray-600 cursor-not-allowed"
                  )}
                >
                  {submittingReview ? "..." : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
