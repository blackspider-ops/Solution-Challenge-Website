import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const count = await db.announcementSent.count({
      where: { announcementId: id },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Get sent count error:", error);
    return NextResponse.json({ error: "Failed to get count" }, { status: 500 });
  }
}
