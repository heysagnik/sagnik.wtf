import { NextRequest, NextResponse } from "next/server";
import { redis, REACTIONS_KEY, reactionField, getReactionsHash, patchReactionsCache, reactionRateLimit } from "@/lib/redis";
import { isReactionEmoji, type ReactionState } from "@/lib/reactions";

const MAX_ID_LENGTH = 64;
const MAX_IDS_PER_REQUEST = 100;

function tallyMessage(hash: Record<string, string>, messageId: string, guestId: string): ReactionState {
  const counts: Record<string, number> = {};
  let mine: string | null = null;
  const prefix = `${messageId}:`;

  for (const [field, emoji] of Object.entries(hash)) {
    if (!field.startsWith(prefix)) continue;
    counts[emoji] = (counts[emoji] || 0) + 1;
    if (field.slice(prefix.length) === guestId) mine = emoji;
  }

  return { counts, mine };
}

// GET /api/reactions?ids=1,1.1,1.2&guestId=xxx — bulk-read counts + "mine"
// for every message id from a single (often cached) HGETALL, not one per id.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");
  const guestId = searchParams.get("guestId") || "";

  if (!idsParam) {
    return NextResponse.json({});
  }

  const ids = idsParam.split(",").filter(Boolean).slice(0, MAX_IDS_PER_REQUEST);
  if (ids.length === 0) {
    return NextResponse.json({});
  }

  const hash = await getReactionsHash();

  const reactions: Record<string, ReactionState> = {};
  ids.forEach((id) => {
    reactions[id] = tallyMessage(hash, id, guestId);
  });

  return NextResponse.json(reactions);
}

// POST /api/reactions { messageId, guestId, emoji } — toggle: setting the
// same emoji a guest already has removes it, otherwise it's added/replaced.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { messageId, guestId, emoji } = body as Record<string, unknown>;

  if (
    typeof messageId !== "string" || !messageId || messageId.length > MAX_ID_LENGTH ||
    typeof guestId !== "string" || !guestId || guestId.length > MAX_ID_LENGTH ||
    typeof emoji !== "string" || !isReactionEmoji(emoji)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { success } = await reactionRateLimit.limit(guestId);
  if (!success) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const field = reactionField(messageId, guestId);
  const current = await redis.hget<string>(REACTIONS_KEY, field);
  const isRemoving = current === emoji;

  if (isRemoving) {
    await redis.hdel(REACTIONS_KEY, field);
  } else {
    await redis.hset(REACTIONS_KEY, { [field]: emoji });
  }

  patchReactionsCache(field, isRemoving ? null : emoji);

  const hash = await getReactionsHash();
  const { counts, mine } = tallyMessage(hash, messageId, guestId);

  return NextResponse.json({ messageId, counts, mine });
}
