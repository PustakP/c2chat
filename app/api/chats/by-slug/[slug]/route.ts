import { connectMongo } from "@/lib/db";
import { ChatModel } from "@/lib/models";

export const runtime = "nodejs";

// g: fetch chat by slug
export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) {
  await connectMongo();
  const { slug } = await ctx.params;
  const chat = await ChatModel.findOne({ slug }).lean();
  if (!chat) return new Response("not found", { status: 404 });
  return Response.json(chat);
}


