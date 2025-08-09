import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { connectMongo } from "@/lib/db";
import { ChatModel } from "@/lib/models";

export const runtime = "nodejs";

// s: chat endpoint with context
export async function POST(req: NextRequest) {
  try {
    const { slug, content } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: "missing api key" }), { status: 500 });
    
    // get existing chat context
    await connectMongo();
    const chat = await ChatModel.findOne({ slug });
    
    // build conversation history for ai
    const history = [];
    if (chat?.messages?.length > 0) {
      // convert db messages to gemini format
      for (const msg of chat.messages) {
        history.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      }
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "You are a helpful assistant. Keep responses concise and to the point. Aim for clarity over verbosity. Use bullet points or short paragraphs when appropriate. Avoid unnecessary elaboration unless specifically requested.",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800, // limit response length
      }
    });
    
    // start chat with history or generate single response
    let text: string;
    if (history.length > 0) {
      const chatSession = model.startChat({ history });
      const result = await chatSession.sendMessage(content || "hello");
      text = result.response.text();
    } else {
      const resp = await model.generateContent(content || "hello");
      text = resp.response.text();
    }
    
    // persist new messages
    if (chat) {
      chat.messages.push({ role: "user", content });
      chat.messages.push({ role: "assistant", content: text });
      await chat.save();
    }
    return Response.json({ reply: text });
  } catch (e) {
    return new Response(JSON.stringify({ error: "failed" }), { status: 500 });
  }
}


