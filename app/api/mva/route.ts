import { NextRequest } from "next/server";
import { chatCompletion } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { idea, domain, targetUser, type } = await request.json();

    if (!idea) {
      return Response.json({ error: "缺少创意描述" }, { status: 400 });
    }

    if (type === "prompt") {
      // 生成 System Prompt
      const content = await chatCompletion(
        [
          {
            role: "system",
            content: `你是一个专业的 AI 提示词工程师，擅长为全栈 MVP 项目生成高质量的 System Prompt。
你生成的提示词需要：
1. 遵循标准 System Prompt 规范（角色定义、能力边界、输出格式、约束条件）
2. 包含完整的技术栈说明
3. 包含数据模型设计
4. 包含 API 接口规范
5. 包含前端组件结构
6. 长度在 1000-2000 字之间
7. 可以直接粘贴到 Claude/GPT/Cursor 等工具中运行出完整 MVP`,
          },
          {
            role: "user",
            content: `请为以下创意生成一个完整的 MVP System Prompt：

**创意描述：** ${idea}
${domain ? `**技术领域：** ${domain}` : ""}
${targetUser ? `**目标用户：** ${targetUser}` : ""}

要求：生成可以直接用于 AI 编程工具（Cursor/Claude/GPT）的完整 System Prompt，让 AI 能够直接跑出全栈 MVP。`,
          },
        ],
        { temperature: 0.6, max_tokens: 2500 }
      );

      return Response.json({ content, type: "prompt" });
    }

    if (type === "stack") {
      // 生成研发栈推荐
      const content = await chatCompletion(
        [
          {
            role: "system",
            content: `你是一个全栈架构师，专门为创业项目和 MVP 推荐最优技术栈。
你的推荐需要：
1. 考虑快速上线（优先选择有托管服务的方案）
2. 给出具体的工具/服务名称和版本
3. 估算每月成本（免费额度 + 超出后的费用）
4. 说明选择理由和替代方案
5. 给出部署步骤概览`,
          },
          {
            role: "user",
            content: `请为以下 MVP 项目推荐完整的研发技术栈：

**项目描述：** ${idea}
${domain ? `**技术领域：** ${domain}` : ""}
${targetUser ? `**目标用户：** ${targetUser}` : ""}

请按以下结构输出：
## 推荐技术栈清单
（前端、后端、数据库、AI 接口、部署、监控）

## 成本估算
（免费额度内能支撑多少用户，超出后的月费）

## 快速启动步骤
（5步内能跑起来的最简路径）

## 替代方案对比
（如果预算/技术栈有限制时的备选）`,
          },
        ],
        { temperature: 0.5, max_tokens: 2000 }
      );

      return Response.json({ content, type: "stack" });
    }

    if (type === "mockdata") {
      // 生成模拟测试数据
      const content = await chatCompletion(
        [
          {
            role: "system",
            content: `你是一个数据工程师，专门为科研和数据型产品生成符合业务逻辑的 Mock 数据。
生成的数据需要：
1. 符合跨界逻辑（数据结构要体现领域特征）
2. 包含完整的 JSON Schema 定义
3. 提供 10-20 条示例数据
4. 包含 Python/R 代码片段用于加载和验证数据
5. 说明数据字段的业务含义`,
          },
          {
            role: "user",
            content: `请为以下项目生成模拟测试数据集：

**项目描述：** ${idea}
${domain ? `**技术领域：** ${domain}` : ""}

请输出：
1. JSON Schema 定义
2. 10-20 条符合逻辑的示例数据（JSON 格式）
3. Python 代码片段（加载数据并做基础验证）`,
          },
        ],
        { temperature: 0.6, max_tokens: 2500 }
      );

      return Response.json({ content, type: "mockdata" });
    }

    // 默认：生成 MVA 概览
    const content = await chatCompletion(
      [
        {
          role: "system",
          content: `你是 NexusMind MVA（最小可行性架构）生成引擎。
你的任务是为一个跨界创新想法生成完整的 MVA 报告，包括：
1. 技术拓扑图（文字描述，用 ASCII 或 Mermaid 格式）
2. 最小可行性验证路径（分阶段，每阶段有明确的验收标准）
3. 核心假设清单（需要验证的关键假设，按优先级排序）
4. 风险矩阵（概率 × 影响 = 风险等级）
5. 资源需求估算（时间、人力、资金）`,
        },
        {
          role: "user",
          content: `请为以下创意生成 MVA 报告：

**创意描述：** ${idea}
${domain ? `**技术领域：** ${domain}` : ""}
${targetUser ? `**目标用户：** ${targetUser}` : ""}`,
        },
      ],
      { temperature: 0.6, max_tokens: 3000 }
    );

    return Response.json({ content, type: "overview" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("MVA API error:", msg);
    return Response.json(
      { error: `AI 服务错误：${msg}` },
      { status: 500 }
    );
  }
}
