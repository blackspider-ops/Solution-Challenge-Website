import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { oldName, newName } = await request.json();

    const updated = await db.team.updateMany({
      where: { name: oldName },
      data: { name: newName }
    });

    return NextResponse.json({ 
      success: true, 
      count: updated.count,
      message: `Updated ${updated.count} team(s) from "${oldName}" to "${newName}"`
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
