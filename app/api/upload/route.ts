import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadFile, validateFile } from "@/lib/blob";

// Rate limiting for file uploads
const uploadRateLimitMap = new Map<string, number[]>();
const UPLOAD_RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_UPLOADS_PER_HOUR = 10; // Max 10 uploads per hour per user

function isUploadRateLimited(userId: string): boolean {
  const now = Date.now();
  const requests = uploadRateLimitMap.get(userId) || [];
  
  const recentRequests = requests.filter(
    (timestamp) => now - timestamp < UPLOAD_RATE_LIMIT_WINDOW
  );
  
  uploadRateLimitMap.set(userId, recentRequests);
  
  if (recentRequests.length >= MAX_UPLOADS_PER_HOUR) {
    return true;
  }
  
  recentRequests.push(now);
  uploadRateLimitMap.set(userId, recentRequests);
  
  return false;
}

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called");
    
    // Check authentication
    const session = await auth();
    console.log("Session:", session?.user?.id ? "authenticated" : "not authenticated");
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    if (isUploadRateLimited(session.user.id)) {
      return NextResponse.json(
        { error: "Upload limit exceeded. Maximum 10 files per hour." },
        { status: 429 }
      );
    }

    // Get the file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("File received:", file ? `${file.name} (${file.size} bytes)` : "no file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file);
    console.log("Validation result:", validation);
    
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check if blob token is configured
    const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
    console.log("BLOB_READ_WRITE_TOKEN configured:", hasToken);
    
    if (!hasToken) {
      console.error("BLOB_READ_WRITE_TOKEN is not configured");
      return NextResponse.json(
        { error: "File storage is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Upload to Vercel Blob
    console.log("Starting upload to Vercel Blob...");
    const url = await uploadFile(file, "resumes");
    console.log("Upload complete:", url);

    return NextResponse.json({
      success: true,
      url,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
    });
    
    const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
