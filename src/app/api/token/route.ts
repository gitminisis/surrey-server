import { EASYLOAD_BASE_API, urls } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const token = await fetch(EASYLOAD_BASE_API + urls.TOKEN, {
    cache: "no-store",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: process.env.TENANT_ID,
      password: process.env.TENANT_PASSWORD,
    }),
  });
  const content = await token.json();
  return NextResponse.json(content);
}
