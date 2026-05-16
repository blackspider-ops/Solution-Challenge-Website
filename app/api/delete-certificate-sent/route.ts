import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { certificateName, userEmail } = await request.json();

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found" 
      }, { status: 404 });
    }

    // Find certificate by name
    const certificate = await db.certificate.findFirst({
      where: { name: certificateName }
    });

    if (!certificate) {
      return NextResponse.json({ 
        success: false, 
        error: "Certificate not found" 
      }, { status: 404 });
    }

    // Delete the sent record
    const deleted = await db.certificateSent.deleteMany({
      where: { 
        certificateId: certificate.id,
        userId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      count: deleted.count,
      message: `Deleted ${deleted.count} certificate record(s) for ${userEmail}`
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
