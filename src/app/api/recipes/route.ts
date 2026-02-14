import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  try {
    const recipes = await db.query.recipes.findMany({});
    return NextResponse.json({ recipes });
  } catch (err) { }
}
