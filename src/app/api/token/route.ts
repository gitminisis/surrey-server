import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  const token = await fetch(
    "https://easyload-dev.azurewebsites.net//api/auth/token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: process.env.TENANT_ID,
        password: process.env.TENANT_PASSWORD,
      }),
    }
  );
  const content = await token.json();
  console.log(content);
  return NextResponse.json(content);
}
