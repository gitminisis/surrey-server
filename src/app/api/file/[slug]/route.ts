import { NextRequest, NextResponse } from "next/server";
const BASE_DIRECTORY = process.env.BASE_DIRECTORY;
import { promises as fs } from "fs";
import path from 'path'
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const fileName = params.slug;

  if (fileName.trim() === "") {
    return NextResponse.error();
  }
  try {
    const filePath = path.normalize(`${BASE_DIRECTORY}/json/${fileName}/data.json`)
    console.log(filePath)

    const file = await fs.readFile(
      filePath,
      "utf-8"
    );
    const content = JSON.parse(file);
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const fileName = params.slug;
  console.log(fileName);
  if (fileName.trim() === "") {
    return NextResponse.error();
  }
  const data = await request.json();
  const content = JSON.stringify(data.data);
  try {
    const file = await fs.writeFile(
      `${BASE_DIRECTORY}/json/${fileName}/data.json`,
      content as string
    );
    return NextResponse.json({
      "success": 200,
      "title": "Site content update",
      "message": "Data has been updated successfully.",
      "data": content,
    });
  } catch (error) {
    return NextResponse.error();
  }
}
