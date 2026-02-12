import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isValidPersistedData } from "@/lib/persistence";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "templates.json");

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (!isValidPersistedData(data)) {
      return NextResponse.json({ saved: false });
    }
    return NextResponse.json({ saved: true, data });
  } catch {
    return NextResponse.json({ saved: false });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isValidPersistedData(body)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await fs.mkdir(DATA_DIR, { recursive: true });

    // Atomic write: write to temp file, then rename
    const tmpFile = path.join(DATA_DIR, `templates.tmp.${Date.now()}.json`);
    await fs.writeFile(tmpFile, JSON.stringify(body, null, 2), "utf-8");
    await fs.rename(tmpFile, DATA_FILE);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save templates:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
