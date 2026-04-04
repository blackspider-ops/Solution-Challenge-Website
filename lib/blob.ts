import { put, del } from "@vercel/blob";

/**
 * Upload a file to Vercel Blob storage
 * Returns the URL of the uploaded file
 */
export async function uploadFile(file: File, folder: string = "resumes"): Promise<string> {
  try {
    console.log("Starting file upload:", {
      name: file.name,
      size: file.size,
      type: file.type,
      folder,
    });

    const filename = `${folder}/${Date.now()}-${file.name}`;
    
    console.log("Uploading to blob with filename:", filename);
    
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    });
    
    console.log("Upload successful:", blob.url);
    
    return blob.url;
  } catch (error) {
    console.error("File upload error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

/**
 * Delete a file from Vercel Blob storage
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error("File delete error:", error);
    throw new Error("Failed to delete file");
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only PDF and Word documents are allowed" };
  }

  return { valid: true };
}
