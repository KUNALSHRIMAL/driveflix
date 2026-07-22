import axios from "axios";

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

export async function getDriveVideos(accessToken: string) {
  const response = await axios.get(DRIVE_API, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      q: "mimeType contains 'video/' and trashed=false",
      fields:
        "files(id,name,mimeType,thumbnailLink,modifiedTime,size)",
      pageSize: 100,
      orderBy: "modifiedTime desc",
    },
  });

  console.log("Drive API files count", response.data.files.length);
  console.log("Drive API files", response.data.files);

  return response.data.files;
}
