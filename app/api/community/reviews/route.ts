import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/community/reviews?idea_id=xxx — 获取某个点子的评议
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get("idea_id");

    if (!ideaId) {
      return Response.json({ error: "缺少 idea_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("idea_reviews")
      .select("id, reviewer_domain, content, created_at")
      .eq("idea_id", ideaId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return Response.json({ reviews: data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}

// POST /api/community/reviews — 提交评议
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { idea_id, reviewer_domain, content } = await request.json();

    if (!idea_id || !content?.trim()) {
      return Response.json({ error: "缺少必要参数" }, { status: 400 });
    }

    // 插入评议
    const { error: reviewError } = await supabase
      .from("idea_reviews")
      .insert({
        idea_id,
        reviewer_domain: reviewer_domain?.trim() || "匿名",
        content: content.trim(),
        // reviewer_id 为 null（匿名）
      });

    if (reviewError) throw reviewError;

    // 更新点子的评议计数
    const { error: countError } = await supabase.rpc("increment_reviews_count", {
      idea_id_param: idea_id,
    });

    // 如果 RPC 不存在也不影响主流程
    if (countError) {
      console.warn("increment_reviews_count RPC not found, updating manually");
      // 手动更新计数
      const { data: idea } = await supabase
        .from("community_ideas")
        .select("reviews_count")
        .eq("id", idea_id)
        .single();

      if (idea) {
        await supabase
          .from("community_ideas")
          .update({ reviews_count: (idea.reviews_count || 0) + 1 })
          .eq("id", idea_id);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Review POST error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
