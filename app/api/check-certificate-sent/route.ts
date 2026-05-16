import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userEmail } = await request.json();

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: userEmail },
      include: {
        certificatesSent: {
          include: {
            certificate: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      user: {
        email: user.email,
        name: user.name
      },
      certificatesSent: user.certificatesSent.map(cs => ({
        certificateId: cs.certificateId,
        certificateName: cs.certificate.name,
        sentAt: cs.sentAt
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
