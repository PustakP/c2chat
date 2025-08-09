import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { connectMongo } from "@/lib/db";
import { ChatModel } from "@/lib/models";

export const runtime = "nodejs";

// s: auto name via gemini
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: "missing api key" }), { status: 500 });
  try {
    const { messages } = await req.json().catch(() => ({ messages: [] }));
    const last = Array.isArray(messages) && messages.length ? messages[messages.length - 1]?.content : "a conversation";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `name this chat in 3-5 words, title case, without quotes. topic: ${last}`;
    const resp = await model.generateContent(prompt);
    const text = resp.response.text().replace(/\n/g, " ").trim();
    await connectMongo();
    const { id } = await ctx.params;
    await ChatModel.findByIdAndUpdate(id, { title: text });
    return Response.json({ title: text });
  } catch (e) {
    return new Response(JSON.stringify({ error: "failed" }), { status: 500 });
  }
}


