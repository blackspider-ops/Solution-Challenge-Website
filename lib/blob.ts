import { put, del } from "@vercel/blob";

export async function uploadFile(file: File, folder: string = "resumes"): Promise<string> {
  const filename = `${folder}/${Date.now()}-${file.name}`;
  
  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: true,
  });
  
  return blob.url;
}

export async function deleteFile(url: string): Promise<void> {
  await del(url);
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024;
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
