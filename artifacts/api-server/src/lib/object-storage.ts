import { randomUUID } from "node:crypto";

const SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

function privateObjectDir(): string {
  const dir = process.env.PRIVATE_OBJECT_DIR;
  if (!dir) throw new Error("PRIVATE_OBJECT_DIR is not configured");
  return dir.replace(/\/+$/, "");
}

function parseObjectPath(path: string): { bucketName: string; objectName: string } {
  const parts = path.replace(/^\/+/, "").split("/");
  const bucketName = parts.shift();
  if (!bucketName || parts.length === 0) throw new Error("Invalid object path");
  return { bucketName, objectName: parts.join("/") };
}

async function signObjectUrl(
  path: string,
  method: "PUT" | "GET",
  contentType?: string,
): Promise<string> {
  const { bucketName, objectName } = parseObjectPath(path);
  const response = await fetch(`${SIDECAR_ENDPOINT}/object-storage/signed-object-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bucket_name: bucketName,
      object_name: objectName,
      method,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      ...(contentType ? { content_type: contentType } : {}),
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Object storage signing failed (${response.status})`);
  const body = (await response.json()) as { signed_url?: string };
  if (!body.signed_url) throw new Error("Object storage did not return a signed URL");
  return body.signed_url;
}

export async function createReceiptUpload(contentType: string): Promise<{ uploadURL: string; objectPath: string }> {
  const objectPath = `/objects/uploads/receipts/${randomUUID()}`;
  const uploadURL = await signObjectUrl(`${privateObjectDir()}${objectPath.slice("/objects".length)}`, "PUT", contentType);
  return { uploadURL, objectPath };
}

export async function createReceiptDownload(objectPath: string): Promise<string> {
  if (!objectPath.startsWith("/objects/")) throw new Error("Invalid receipt path");
  return signObjectUrl(`${privateObjectDir()}${objectPath.slice("/objects".length)}`, "GET");
}

export async function createMediaUpload(
  contentType: string,
): Promise<{ uploadURL: string; objectPath: string }> {
  const objectPath = `/objects/uploads/media/${randomUUID()}`;
  const uploadURL = await signObjectUrl(
    `${privateObjectDir()}${objectPath.slice("/objects".length)}`,
    "PUT",
    contentType,
  );
  return { uploadURL, objectPath };
}

export async function createMediaDownload(objectPath: string): Promise<string> {
  if (!objectPath.startsWith("/objects/uploads/media/")) {
    throw new Error("Invalid media path");
  }
  return signObjectUrl(
    `${privateObjectDir()}${objectPath.slice("/objects".length)}`,
    "GET",
  );
}