import axios from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.formData();
  const headers = {
    Blobid: req.get("Blobid")?.toString(),
    Blobname: req.get("Blobname")?.toString(),
    MimeType: req.get("MimeType")?.toString(),
    User: req.get("User")?.toString(),
    Chunkid: req.get("Chunkid"),
    Blockid: parseInt(req.get("Blockid")?.toString() || "1"),
    Tenant: req.get("Tenant")?.toString(),
    "Content-Type": "application/offset+octet-stream",
    Authorization: `Bearer ${req.get("Token")?.toString().trim()}`,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
  };

  axios.defaults.headers.put["Content-Type"] = "application/json";


  
}
