import { NextRequest, NextResponse } from "next/server";
const BASE_DIRECTORY = process.env.BASE_DIRECTORY;
import { promises as fs } from "fs";
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const fileName = params.slug;

  if (fileName.trim() === "") {
    return NextResponse.error();
  }

  try {
    const file = await fs.readFile(
      `${BASE_DIRECTORY}/json/${fileName}.json`,
      "utf-8"
    );
    const content = JSON.parse(file);
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const fileName = params.slug;
  if (fileName.trim() === "") {
    return NextResponse.error();
  }
  const data = await request.formData();
  const content = data.get("data");
  try {
    const file = await fs.writeFile(
      `${BASE_DIRECTORY}/json/${fileName}.json`,
      content as string
    );
    return NextResponse.json({ content: data.get("data") });
  } catch (error) {
    return NextResponse.error();
  }
}
