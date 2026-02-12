import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidPersistedData, isValidUUID } from "@/lib/persistence";

// GET /api/templates?projectId=xxx — load template data for a project
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId || !isValidUUID(projectId)) {
      return NextResponse.json({ error: "Valid projectId is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("projects")
      .select("data")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ saved: false });
    }

    if (!isValidPersistedData(data.data)) {
      return NextResponse.json({ saved: false });
    }

    return NextResponse.json({ saved: true, data: data.data });
  } catch {
    return NextResponse.json({ saved: false });
  }
}

// POST /api/templates?projectId=xxx — save template data for a project
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId || !isValidUUID(projectId)) {
      return NextResponse.json({ error: "Valid projectId is required" }, { status: 400 });
    }

    const body = await request.json();
    if (!isValidPersistedData(body)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { error } = await supabase
      .from("projects")
      .update({ data: body })
      .eq("id", projectId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to save templates:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save templates:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
