import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/community — 获取已发布的点子列表
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const from = (page - 1) * pageSize;

    const { data, error, count } = await supabase
      .from("community_ideas")
      .select(
        "id, core_logic, tags, domain_cross, cert_id, reviews_count, created_at",
        { count: "exact" }
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw error;

    return Response.json({ ideas: data, total: count, page, pageSize });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Community GET error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}

// POST /api/community — 发布新点子
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { core_logic, tags, domain_cross } = body;

    if (!core_logic?.trim()) {
      return Response.json({ error: "创意内容不能为空" }, { status: 400 });
    }

    // 生成确权证书 ID 和哈希
    const certId = `NM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const certHash = Buffer.from(core_logic + certId)
      .toString("base64")
      .slice(0, 24)
      .toUpperCase();

    // 解析标签（逗号分隔字符串 → 数组）
    const tagsArray = tags
      ? tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

    const { data, error } = await supabase
      .from("community_ideas")
      .insert({
        core_logic: core_logic.trim(),
        tags: tagsArray,
        domain_cross: domain_cross?.trim() || null,
        cert_id: certId,
        cert_hash: certHash,
        is_published: true,
        // user_id 为 null（匿名发布，无需登录）
      })
      .select("id, cert_id, cert_hash, created_at")
      .single();

    if (error) throw error;

    return Response.json({ success: true, ...data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Community POST error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
