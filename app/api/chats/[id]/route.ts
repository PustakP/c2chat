import { connectMongo } from "@/lib/db";
import { ChatModel } from "@/lib/models";

export const runtime = "nodejs";

// d: delete chat
export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  await connectMongo();
  const { id } = await ctx.params;
  await ChatModel.findByIdAndDelete(id);
  return Response.json({ ok: true });
}


