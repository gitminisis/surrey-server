import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const res = await request.json();
  console.log(res);
  const { BlobId, BlobName, BlockId, Tenant } = res;
  
}
