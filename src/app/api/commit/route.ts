import { EASYLOAD_BASE_API, urls } from "@/lib/upload";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.formData();
    const headers = {
      Blobid: req.get("Blobid")?.toString(),
      Blobname: req.get("Blobname")?.toString(),
      MimeType: req.get("MimeType")?.toString(),
      User: req.get("User")?.toString(),
      Tenant: req.get("Tenant")?.toString(),
      Authorization: `Bearer ${req.get("Token")?.toString().trim()}`,
    };

    axios.defaults.headers.put["Content-Type"] = "application/json";

  
    const upload = await axios.post(
      EASYLOAD_BASE_API + urls.ASSETS_UPLOAD_COMMIT,
      req.get("Chunkid") || [],
      {
        headers,
      }
    );

    if (upload.status === 201) {
      return NextResponse.json({ success: true, data: upload.data });
    }

    return NextResponse.json({
      success: false,
      message: "Commit request failed",
    });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
