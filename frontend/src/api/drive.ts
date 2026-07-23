import axios from "axios";

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
const ROOT_FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID?.trim();
const FOLDER_CONCURRENCY = 5;
const LIBRARY_LIMIT = 50;

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  modifiedTime: string;
  size?: string;
}

interface DriveFileList {
  nextPageToken?: string;
  files: DriveFile[];
}

const escapeDriveQueryValue = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

async function listFiles(
  accessToken: string,
  query: string,
  limit = LIBRARY_LIMIT
): Promise<DriveFile[]> {
  const files: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const response = await axios.get<DriveFileList>(DRIVE_API, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        fields:
          "nextPageToken,files(id,name,mimeType,thumbnailLink,modifiedTime,size)",
        pageSize: Math.min(limit - files.length, 1000),
        pageToken,
        orderBy: "modifiedTime desc",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      },
    });

    files.push(...response.data.files);
    pageToken = response.data.nextPageToken;
  } while (pageToken && files.length < limit);

  return files.slice(0, limit);
}

async function getVideosRecursively(
  accessToken: string,
  rootFolderId: string,
  limit: number
): Promise<DriveFile[]> {
  const pendingFolders = [rootFolderId];
  const visitedFolders = new Set<string>();
  const videos = new Map<string, DriveFile>();

  while (pendingFolders.length && videos.size < limit) {
    const batch = pendingFolders.splice(0, FOLDER_CONCURRENCY).filter((folderId) => {
      if (visitedFolders.has(folderId)) return false;
      visitedFolders.add(folderId);
      return true;
    });

    const childrenByFolder = await Promise.all(
      batch.map((folderId) =>
        listFiles(
          accessToken,
          `'${escapeDriveQueryValue(folderId)}' in parents and trashed=false and ` +
            `(mimeType contains 'video/' or mimeType='${FOLDER_MIME_TYPE}')`,
          Number.isFinite(limit) ? 1000 : Number.POSITIVE_INFINITY
        )
      )
    );

    for (const children of childrenByFolder) {
      for (const file of children) {
        if (file.mimeType === FOLDER_MIME_TYPE) {
          pendingFolders.push(file.id);
        } else if (file.mimeType.startsWith("video/")) {
          videos.set(file.id, file);

          if (videos.size >= limit) break;
        }
      }

      if (videos.size >= limit) break;
    }
  }

  return Array.from(videos.values()).sort(
    (a, b) =>
      new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
  ).slice(0, limit);
}

export async function getDriveVideos(
  accessToken: string,
  limit = LIBRARY_LIMIT
) {
  if (ROOT_FOLDER_ID) {
    return getVideosRecursively(accessToken, ROOT_FOLDER_ID, limit);
  }

  return listFiles(
    accessToken,
    "mimeType contains 'video/' and trashed=false",
    limit
  );
}
