import { createClient } from "@supabase/supabase-js";

// Server-side client with service role (admin access)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Upload a file to Supabase Storage
export async function uploadCleanerID(
  file: Buffer,
  fileName: string,
  mimeType: string
): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from("cleaner-ids")
    .upload(fileName, file, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    return null;
  }

  // Return a signed URL valid for 1 hour (admin viewing)
  const { data: urlData } = await supabaseAdmin.storage
    .from("cleaner-ids")
    .createSignedUrl(data.path, 3600);

  return urlData?.signedUrl ?? null;
}

// Get a fresh signed URL for an existing file path
export async function getSignedUrl(filePath: string): Promise<string | null> {
  const { data } = await supabaseAdmin.storage
    .from("cleaner-ids")
    .createSignedUrl(filePath, 3600);
  return data?.signedUrl ?? null;
}
