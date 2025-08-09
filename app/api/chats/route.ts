import { NextRequest } from "next/server";
import { connectMongo } from "@/lib/db";
import { ChatModel } from "@/lib/models";

export const runtime = "nodejs";

// g: list + create
export async function GET(req: NextRequest) {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 20);
  const total = await ChatModel.countDocuments();
  const chats = await ChatModel.find({}, { messages: { $slice: -1 } })
    .sort({ updatedAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();
  return Response.json({ total, page, pageSize, chats });
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const body = await req.json();
  const { slug } = body;
  const doc = await ChatModel.create({ slug, messages: [] });
  return Response.json({ id: doc._id.toString(), slug: doc.slug });
}


