const MEDIA_UPLOAD_URL = "/api/storage/media/uploads/request-url";

export async function uploadImage(file: File): Promise<string> {
  const response = await fetch(MEDIA_UPLOAD_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      contentType: file.type,
    }),
  });

  const body = (await response.json()) as {
    uploadURL?: string;
    objectPath?: string;
    error?: string;
  };
  if (!response.ok || !body.uploadURL || !body.objectPath) {
    throw new Error(body.error ?? "Could not prepare image upload.");
  }

  const uploadResponse = await fetch(body.uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!uploadResponse.ok) {
    throw new Error("Could not upload image.");
  }

  return `/api/storage/media${body.objectPath.slice("/objects".length)}`;
}