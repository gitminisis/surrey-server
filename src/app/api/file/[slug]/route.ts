import { NextRequest, NextResponse } from "next/server";
const BASE_DIRECTORY = process.env.BASE_DIRECTORY;
import { promises as fs } from "fs";
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug; // 'a', 'b', or 'c'

  if (slug.trim() === "") {
    return NextResponse.error();
  }

  try {
    const file = await fs.readFile(
      `${BASE_DIRECTORY}/json/${slug}.json`,
      "utf-8"
    );
    const content = JSON.parse(file);
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.error();
  }
}
