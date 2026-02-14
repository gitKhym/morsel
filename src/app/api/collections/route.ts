import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  try {
    const collections = await db.query.collections.findMany({});
    return NextResponse.json({ collections });
  } catch (err) { }
}
