import { NextRequest } from "next/server";
import { chatCompletion } from "@/lib/ai";

const HAT_ROLES = [
  {
    hat: "白帽",
    color: "white",
    emoji: "🤍",
    role: "数据与事实分析师",
    prompt:
      "你是白帽思考者，只关注客观数据和已知事实。列出这个想法中有哪些已被验证的事实支撑，哪些是假设，哪些数据缺失。不做评价，只陈述事实。",
  },
  {
    hat: "红帽",
    color: "red",
    emoji: "❤️",
    role: "直觉与情感评估师",
    prompt:
      "你是红帽思考者，代表直觉、情感和本能反应。从用户体验和情感角度评估这个想法：目标用户会有什么感受？这个想法在情感上是否有共鸣？有哪些情感障碍？",
  },
  {
    hat: "黑帽",
    color: "black",
    emoji: "🖤",
    role: "风险与批判分析师",
    prompt:
      "你是黑帽思考者，代表最严厉的批判性分析。找出这个想法最致命的缺陷、最大的风险、最可能失败的原因。不要客气，要像最挑剔的投资人或竞争对手一样思考。",
  },
  {
    hat: "黄帽",
    color: "yellow",
    emoji: "💛",
    role: "价值与机会挖掘师",
    prompt:
      "你是黄帽思考者，专注于发现价值和机会。找出这个想法最有潜力的方面、最可能成功的路径、被低估的优势。要有具体的价值量化分析。",
  },
  {
    hat: "绿帽",
    color: "green",
    emoji: "💚",
    role: "创意与变体生成师",
    prompt:
      "你是绿帽思考者，代表创造力和新可能性。基于这个想法，提出 3-5 个变体方向或延伸创意，包括完全不同的实现路径、意想不到的应用场景、跨界组合方式。",
  },
  {
    hat: "蓝帽",
    color: "blue",
    emoji: "💙",
    role: "元认知与流程协调师",
    prompt:
      "你是蓝帽思考者，负责元认知和整体协调。综合以上所有视角，给出：1）这个想法的整体可行性评分（1-10）及理由；2）最关键的 3 个待验证假设；3）建议的下一步行动优先级。",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { idea, context } = await request.json();

    if (!idea) {
      return Response.json({ error: "缺少创意描述" }, { status: 400 });
    }

    const systemBase = `你是 NexusMind 第一性原理断裂测试系统的一个 AI 角色。
你的分析对象是一个跨界创新想法。
要求：专业、深刻、有实质内容，不要泛泛而谈，不要奉承，直接指出核心问题。
每个回答控制在 200-400 字，用 Markdown 格式输出。`;

    const ideaContext = `
**跨界创意：** ${idea}
${context ? `**背景信息：** ${context}` : ""}`;

    // 并行调用所有六顶帽
    const results = await Promise.all(
      HAT_ROLES.map(async (hat) => {
        const content = await chatCompletion(
          [
            {
              role: "system",
              content: `${systemBase}\n\n你现在扮演的角色：${hat.role}\n${hat.prompt}`,
            },
            {
              role: "user",
              content: `请用${hat.hat}帽视角分析以下跨界创意：\n${ideaContext}`,
            },
          ],
          { temperature: 0.7, max_tokens: 600 }
        );
        return {
          hat: hat.hat,
          color: hat.color,
          emoji: hat.emoji,
          role: hat.role,
          content,
        };
      })
    );

    return Response.json({ results });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Stress test API error:", msg);
    return Response.json(
      { error: `AI 服务错误：${msg}` },
      { status: 500 }
    );
  }
}
