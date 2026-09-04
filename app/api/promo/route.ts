import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import { claimPromoCode } from "@/lib/models";
import { REWARD_THRESHOLD } from "@/lib/promo";
import { claimPromoSchema } from "@/lib/validation/promo";

export async function POST(request: NextRequest) {
  if (!(await isDatabaseAvailable())) {
    return NextResponse.json(
      { error: "Database is unavailable in static mode" },
      { status: 503 }
    );
  }

  const parsed = claimPromoSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { userId, score } = parsed.data;

  if (score < REWARD_THRESHOLD) {
    return NextResponse.json({ eligible: false });
  }

  try {
    const promo = await claimPromoCode(userId);
    return NextResponse.json({ eligible: true, promo });
  } catch (error) {
    console.error("Failed to claim promo:", error);
    return NextResponse.json(
      { error: "Failed to claim promo" },
      { status: 500 }
    );
  }
}
