import { NextRequest, NextResponse } from "next/server";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE = "https://www.omdbapi.com";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!OMDB_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `${OMDB_BASE}/?i=${id}&plot=full&apikey=${OMDB_API_KEY}`
    );
    const data = await res.json();

    if (data.Response === "False") {
      return NextResponse.json({ error: data.Error || "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 });
  }
}
