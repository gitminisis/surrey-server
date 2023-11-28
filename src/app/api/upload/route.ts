import { EASYLOAD_BASE_API, urls } from "@/lib/upload";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const sliceChunks = (
  file: Blob & { readonly lastModified: number; readonly name: string },
  chunkSize: number
) => {
  let startPointer = 0;
  const endPointer = file.size;
  const chunks = new Array<Blob>();
  while (startPointer < endPointer) {
    const newStartPointer = startPointer + chunkSize;
    chunks.push(file.slice(startPointer, newStartPointer));
    startPointer = newStartPointer;
  }
  return chunks;
};
export async function POST(request: NextRequest) {
  try {
    const req = await request.formData();
    const chunkSize = 512 * 1024;
    const headers = {
      Blobid: req.get("Blobid")?.toString(),
      Blobname: req.get("Blobname")?.toString(),
      Blockid: parseInt(req.get("Blockid")?.toString() || "1"),
      Tenant: req.get("Tenant")?.toString(),
      "Content-Type": "application/offset+octet-stream",
      Authorization: `Bearer ${req.get("Token")?.toString().trim()}`,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    };

    axios.defaults.headers.put["Content-Type"] = "application/json";

    const blob = req.get("File") as File;
    const chunks = sliceChunks(blob, chunkSize);
    const blockIds = [];
    for (let index = 0; index < chunks.length; index++) {
      const fileChunk = chunks[index];
      const arrayBuffer = await fileChunk.arrayBuffer();
      blockIds.push(arrayBuffer);
      console.log({
        headers,
        buffer: arrayBuffer,
      });
      const upload = await axios.post(
        EASYLOAD_BASE_API + urls.ASSETS_UPLOAD_CHUNK,
        arrayBuffer,
        {
          headers,
        }
      );
      if (upload.status === 201) {
        return NextResponse.json({ success: true, data: upload.data });
      }
    }
    return NextResponse.json({
      data: blockIds,
    });
  } catch (e) {
    return NextResponse.json({
      error: e,
    });
  }
}
