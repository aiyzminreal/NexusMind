/**
 * AI 接口封装
 * 支持 OpenAI 兼容接口（OpenAI / DeepSeek / 其他兼容接口）
 *
 * DeepSeek 配置：
 *   OPENAI_BASE_URL=https://api.deepseek.com
 *   OPENAI_MODEL=deepseek-v4-flash
 *
 * OpenAI 配置：
 *   OPENAI_BASE_URL=https://api.openai.com/v1
 *   OPENAI_MODEL=gpt-4o
 */

const BASE_URL = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
const API_KEY = process.env.OPENAI_API_KEY || "";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  messages: Message[],
  options?: {
    temperature?: number;
    max_tokens?: number;
  }
): Promise<string> {
  const url = `${BASE_URL}/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[AI] chatCompletion failed: ${response.status}`, errorText);
    throw new Error(`AI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function streamChatCompletion(
  messages: Message[],
  options?: {
    temperature?: number;
    max_tokens?: number;
  }
): Promise<ReadableStream<Uint8Array>> {
  const url = `${BASE_URL}/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 4096,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[AI] streamChatCompletion failed: ${response.status}`, errorText);
    throw new Error(`AI API error ${response.status}: ${errorText}`);
  }

  return response.body!;
}
