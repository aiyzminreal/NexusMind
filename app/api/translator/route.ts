import { NextRequest } from "next/server";
import { chatCompletion } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { input, direction } = await request.json();

    if (!input || !direction) {
      return Response.json({ error: "缺少必要参数" }, { status: 400 });
    }

    if (direction === "tech-to-scene") {
      // 技术 → 场景翻译（科研人员输入论文摘要）
      const content = await chatCompletion(
        [
          {
            role: "system",
            content: `你是 NexusMind 学术工程翻译官，专门将学术技术内容翻译成商业场景。
你的翻译需要：
1. 准确理解技术的核心能力和局限性
2. 找到真实存在的商业痛点（不是臆想的）
3. 给出具体的付费用户画像（不是泛泛的"企业用户"）
4. 估算市场规模和变现路径
5. 指出技术落地的主要障碍

输出格式（Markdown）：
## 技术核心能力解析
[用非技术语言解释这个技术能做什么、不能做什么]

## 商业变现场景（3个）
[每个场景：场景名称 | 核心痛点 | 解决方案 | 付费用户画像 | 变现模式 | 市场规模估算]

## 落地障碍分析
[技术成熟度、监管风险、市场教育成本等]

## 建议的下一步
[最快验证商业可行性的方法]`,
          },
          {
            role: "user",
            content: `请将以下学术技术内容翻译成商业场景：\n\n${input}`,
          },
        ],
        { temperature: 0.7, max_tokens: 2500 }
      );

      return Response.json({ content, direction });
    }

    if (direction === "scene-to-tech") {
      // 场景 → 技术翻译（PM 输入业务痛点）
      const content = await chatCompletion(
        [
          {
            role: "system",
            content: `你是 NexusMind 学术工程翻译官，专门将业务场景翻译成学术技术语言。
你的翻译需要：
1. 准确识别业务痛点背后的技术本质
2. 给出标准的学术检索词（英文，可直接用于 Google Scholar/Semantic Scholar）
3. 给出经典算法分类和代表性论文
4. 推荐可用的开源实现（GitHub 链接方向）
5. 评估技术难度和工程化成本

输出格式（Markdown）：
## 业务痛点技术本质分析
[这个业务问题在技术上属于什么类型的问题]

## 学术检索词（可直接用于 Google Scholar）
[英文关键词列表，按重要性排序]

## 经典算法分类
[算法名称 | 适用场景 | 优缺点 | 代表论文]

## 开源实现推荐
[库/框架名称 | GitHub 方向 | 成熟度 | 工程化难度]

## 技术选型建议
[根据业务规模和团队能力给出具体建议]`,
          },
          {
            role: "user",
            content: `请将以下业务痛点翻译成学术技术语言：\n\n${input}`,
          },
        ],
        { temperature: 0.6, max_tokens: 2500 }
      );

      return Response.json({ content, direction });
    }

    return Response.json({ error: "无效的翻译方向" }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Translator API error:", msg);
    return Response.json(
      { error: `AI 服务错误：${msg}` },
      { status: 500 }
    );
  }
}
