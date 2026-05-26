import { NextRequest } from "next/server";
import { streamChatCompletion } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { domain, crossSpan, problem } = await request.json();

    if (!domain || !crossSpan) {
      return Response.json({ error: "缺少必要参数" }, { status: 400 });
    }

    const spanDescriptions: Record<number, string> = {
      1: "同一细分领域内部（如前端框架之间）",
      2: "同行业上下游（如 Web 前端 → 浏览器底层协议）",
      3: "相邻行业（如软件工程 → 系统架构）",
      4: "同大类不同行业（如 IT → 电信）",
      5: "跨大类但有技术交叉（如 IT → 生物信息学）",
      6: "不同学科但有方法论共性（如计算机 → 认知科学）",
      7: "完全不同领域但有结构相似性（如算法 → 经济学博弈论）",
      8: "跨自然科学与社会科学（如数学 → 社会学）",
      9: "跨理工与人文艺术（如工程学 → 音乐理论）",
      10: "完全不相关的底层科学（如 GIS → 遗传学 DNA 编码）",
    };

    const spanDesc = spanDescriptions[crossSpan] || spanDescriptions[5];

    const systemPrompt = `你是 NexusMind 知识图谱对撞引擎，专门帮助科研人员、产品经理和创新者发现跨领域的深层联系。

你的任务是生成一份专业级的"知识对撞报告"，要求：
1. 找到用户领域与目标跨度领域之间真实存在的底层数学/逻辑/结构共性
2. 提供具体的技术转移桥梁路径（不是泛泛而谈，要有具体的概念、方法、工具）
3. 给出 3-5 个可操作的跨界创新方向
4. 语义相似度分析要有实质内容（引用具体的理论、算法、模型名称）
5. 风格：专业、严谨、有深度，面向硬核用户

输出格式（Markdown）：
## 🔬 对撞概览
[简述两个领域的核心范式]

## 🧮 底层结构共性分析
[数学/逻辑/信息论层面的共性，要具体]

## 🌉 技术转移桥梁路径
[具体的迁移路径，每条路径要有：源概念 → 桥接机制 → 目标应用]

## 💡 跨界创新方向（3-5个）
[每个方向要有：方向名称、核心逻辑、潜在价值、验证难点]

## ⚠️ 认知陷阱预警
[跨界时容易犯的错误和需要注意的边界条件]`;

    const userMessage = `
**我的核心领域/当前问题：** ${domain}
${problem ? `**具体问题/场景：** ${problem}` : ""}
**跨度档位：** ${crossSpan}/10（${spanDesc}）

请生成专业级知识对撞报告。`;

    const stream = await streamChatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      { temperature: 0.8, max_tokens: 3000 }
    );

    // 透传 SSE 流
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  continue;
                }
                try {
                  const parsed = JSON.parse(data);
                  const content =
                    parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ content })}\n\n`
                      )
                    );
                  }
                } catch {
                  // 忽略解析错误
                }
              }
            }
          }
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Collider API error:", msg);
    return Response.json(
      { error: `AI 服务错误：${msg}` },
      { status: 500 }
    );
  }
}
