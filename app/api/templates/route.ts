import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidPersistedData } from "@/lib/persistence";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_templates")
      .select("data")
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

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!isValidPersistedData(body)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { error } = await supabase.from("user_templates").upsert(
      {
        user_id: user.id,
        data: body,
      },
      { onConflict: "user_id" }
    );

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
