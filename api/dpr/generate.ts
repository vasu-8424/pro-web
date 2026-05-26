import type { IncomingMessage, ServerResponse } from "http";
import { generateDprText } from "../_gemini";

async function readJsonBody(req: IncomingMessage): Promise<any> {
  const requestWithBody = req as IncomingMessage & { body?: unknown };
  if (requestWithBody.body !== undefined) {
    return requestWithBody.body;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if ((req.method || "GET").toUpperCase() !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const body = await readJsonBody(req);
    const text = await generateDprText(body || {});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, text }));
  } catch (error: any) {
    console.error("DPR Route Error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error?.message || "Failed to generate report" }));
  }
}
