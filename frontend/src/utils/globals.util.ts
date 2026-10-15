export function getFileTypeFromUri(dataUri: string): string {
  const matches = dataUri.match(
    /^data:[a-zA-Z0-9]+\/([a-zA-Z0-9-+.]+);base64,/,
  );
  return matches ? matches[1] : "unknown";
}

export function getBase64FileSize(base64String: string): number {
  const cleanBase64 = base64String.includes(",")
    ? base64String.split(",")[1]
    : base64String;

  const paddingCharacters = (cleanBase64.match(/=/g) || []).length;

  const sizeInBytes = (cleanBase64.length * 3) / 4 - paddingCharacters;

  return sizeInBytes;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Octets";
  const k = 1024;
  const sizes = ["Octets", "Ko", "Mo", "Go"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const toBlobUrl = (uri: string): string => {
  if (!uri.startsWith("data:")) return uri;
  const [header, base64] = uri.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
};
