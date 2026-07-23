let accessToken = "";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "SET_DRIVE_ACCESS_TOKEN") return;

  accessToken = event.data.accessToken;
  event.ports[0]?.postMessage({ ready: true });
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  const prefix = "/drive-stream/";

  if (requestUrl.origin !== self.location.origin || !requestUrl.pathname.startsWith(prefix)) {
    return;
  }

  event.respondWith(streamDriveFile(event.request, requestUrl.pathname.slice(prefix.length)));
});

async function streamDriveFile(request, encodedFileId) {
  if (!accessToken) {
    return new Response("Missing Google Drive authorization", { status: 401 });
  }

  const fileId = decodeURIComponent(encodedFileId);
  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
  });
  const range = request.headers.get("Range");

  if (range) headers.set("Range", range);

  return fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
    {
      method: "GET",
      headers,
      redirect: "follow",
    }
  );
}
