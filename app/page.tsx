import Link from "next/link";
import { Zap, GitMerge, Shield, Cpu, Languages, Users } from "lucide-react";

const features = [
  {
    icon: GitMerge,
    title: "多维知识图谱对撞",
    desc: "双轴对撞机 UI，从同行业上下游到完全不相关的底层科学，语义相似度矩阵 + 技术转移桥梁路径。",
    href: "/collider",
    color: "from-purple-600 to-violet-500",
    glow: "group-hover:shadow-purple-500/20",
  },
  {
    icon: Shield,
    title: "第一性原理断裂测试",
    desc: "六顶思考帽 AI 角色，对你的跨界灵感进行最严厉的批判性分析，突破认知边界。",
    href: "/stress-test",
    color: "from-red-600 to-orange-500",
    glow: "group-hover:shadow-red-500/20",
  },
  {
    icon: Cpu,
    title: "MVA 动态生成器",
    desc: "一键生成技术拓扑图、最小可行性验证路径、研发栈推荐和上千字 System Prompt。",
    href: "/mva",
    color: "from-cyan-600 to-blue-500",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: Languages,
    title: "学术工程双向翻译",
    desc: "论文摘要 → 商业变现场景；业务痛点 → 学术检索词 + 算法分类。打通科研与产品的语言壁垒。",
    href: "/translator",
    color: "from-green-600 to-emerald-500",
    glow: "group-hover:shadow-green-500/20",
  },
  {
    icon: Users,
    title: "盲盒共创社区",
    desc: "去隐私化点子发布，跨领域专家定向评议，创意零知识证明确权，保护你的创作热情。",
    href: "/community",
    color: "from-pink-600 to-rose-500",
    glow: "group-hover:shadow-pink-500/20",
  },
];

const audiences = [
  {
    role: "科研人员",
    pain: "思维被本领域格式化，跨界找不到引路人",
    solution: "知识图谱对撞 + 技术转移路径",
  },
  {
    role: "产品经理",
    pain: "竞品分析同质化，对前沿技术边界了解不足",
    solution: "双向翻译 + MVA 验证路径",
  },
  {
    role: "硬核创作者",
    pain: "灵感碎片化，丰满成 Proposal 时间成本极高",
    solution: "对撞报告 + 一键 System Prompt 生成",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">NexusMind</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {features.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
                >
                  {f.title.split(" ")[0]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-8">
            <Zap className="w-3.5 h-3.5" />
            <span>跨界灵感碰撞与创新加速平台</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">NexusMind</span>
            <br />
            <span className="text-gray-200 text-4xl sm:text-5xl lg:text-6xl">
              让不同领域的知识
            </span>
            <br />
            <span className="text-gray-200 text-4xl sm:text-5xl lg:text-6xl">
              产生核聚变
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            面向科研人员、产品经理和硬核创作者。用 AI 打破领域壁垒，
            从跨界碰撞到最小可行性验证，加速你从灵感到落地的全过程。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/collider"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-500 hover:to-violet-500 transition-all glow-purple text-center"
            >
              开始知识对撞 →
            </Link>
            <Link
              href="/translator"
              className="px-8 py-4 rounded-xl border border-[#1e1e2e] bg-[#12121a] text-gray-300 font-semibold hover:border-purple-500/50 hover:text-white transition-all text-center"
            >
              学术工程翻译
            </Link>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-200 mb-10">
            你是否也有这些困扰？
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {audiences.map((a) => (
              <div
                key={a.role}
                className="card p-6 hover:border-purple-500/30 transition-all"
              >
                <div className="text-purple-400 font-semibold text-sm mb-2">
                  {a.role}
                </div>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  &ldquo;{a.pain}&rdquo;
                </p>
                <div className="flex items-center gap-2 text-cyan-400 text-sm">
                  <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{a.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-200 mb-3">
            四大核心功能 + 社区生态
          </h2>
          <p className="text-center text-gray-500 text-sm mb-12">
            从灵感碰撞到落地验证，全流程覆盖
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className={`group card p-6 hover:border-white/10 transition-all hover:shadow-xl ${feature.glow}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-200 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-4 text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
                    进入功能 →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] py-8 px-4 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-500 text-sm">NexusMind</span>
          </div>
          <p className="text-gray-600 text-xs">
            跨界灵感碰撞与创新加速平台 · 为科研人员、产品经理和硬核创作者而生
          </p>
        </div>
      </footer>
    </div>
  );
}
