import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  isValidPersistedData,
  MAX_PROJECT_NAME_LENGTH,
  MAX_PROJECTS_PER_USER,
} from "@/lib/persistence";

// GET /api/projects — list all projects for the current user
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
      .from("projects")
      .select("id, name, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Failed to list projects:", error);
      return NextResponse.json({ error: "Failed to list projects" }, { status: 500 });
    }

    return NextResponse.json({
      projects: (data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        updatedAt: p.updated_at,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to list projects" }, { status: 500 });
  }
}

// POST /api/projects — create a new project
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
    const name = typeof body.name === "string"
      ? body.name.trim().slice(0, MAX_PROJECT_NAME_LENGTH)
      : "";
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (body.data && !isValidPersistedData(body.data)) {
      return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }

    // Enforce per-user project limit
    const { count, error: countError } = await supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Failed to count projects:", countError);
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }

    if ((count ?? 0) >= MAX_PROJECTS_PER_USER) {
      return NextResponse.json(
        { error: `Maximum of ${MAX_PROJECTS_PER_USER} projects allowed` },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name,
        data: body.data ?? {},
      })
      .select("id, name, updated_at")
      .single();

    if (error) {
      console.error("Failed to create project:", error);
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }

    return NextResponse.json({
      project: {
        id: data.id,
        name: data.name,
        updatedAt: data.updated_at,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
