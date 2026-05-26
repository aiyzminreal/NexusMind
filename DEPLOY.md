# NexusMind 部署指南

## 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

---

## 第一步：配置 AI API Key

编辑 `.env.local`：

```env
# 如果用 OpenAI：
OPENAI_API_KEY=sk-xxxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o

# 如果用 DeepSeek（更便宜，效果也很好）：
OPENAI_API_KEY=sk-xxxx
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat

# 如果用其他 OpenAI 兼容接口，修改 BASE_URL 即可
```

---

## 第二步：配置 Supabase（用户数据存储）

1. 去 https://supabase.com 注册并创建新项目
2. 在 Supabase Dashboard > SQL Editor 中执行 `supabase-schema.sql`
3. 在 Project Settings > API 中找到：
   - `Project URL` → 填入 `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → 填入 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
```

---

## 第三步：部署到 Vercel

1. 把代码推送到 GitHub：
   ```bash
   git add .
   git commit -m "feat: NexusMind initial build"
   git push
   ```

2. 去 https://vercel.com，点击 "New Project"，导入你的 GitHub 仓库

3. 在 Vercel 项目设置 > Environment Variables 中添加所有环境变量：
   - `OPENAI_API_KEY`
   - `OPENAI_BASE_URL`
   - `OPENAI_MODEL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. 点击 Deploy，等待部署完成

5. Vercel 会给你一个 `xxxx.vercel.app` 的域名，可以直接分享给别人访问

---

## 环境变量汇总

| 变量名 | 说明 | 在哪里获取 |
|--------|------|-----------|
| `OPENAI_API_KEY` | AI API 密钥 | OpenAI/DeepSeek 控制台 |
| `OPENAI_BASE_URL` | API 基础 URL | 默认 `https://api.openai.com/v1` |
| `OPENAI_MODEL` | 使用的模型 | 默认 `gpt-4o` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Supabase 项目设置 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名 Key | Supabase 项目设置 |

---

## 注意事项

- AI API Key 只在服务端使用（`lib/ai.ts`），不会暴露给前端用户
- Supabase 的 `anon key` 是公开的，安全性由 Row Level Security (RLS) 保证
- 如果不配置 Supabase，核心 AI 功能仍然可以正常使用，只是历史记录和社区功能不可用
