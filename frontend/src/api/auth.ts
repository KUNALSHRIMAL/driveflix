const GOOGLE_USER_INFO =
  "https://www.googleapis.com/oauth2/v3/userinfo";

export async function getGoogleUser(accessToken: string) {
  const response = await fetch(GOOGLE_USER_INFO, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Google user");
  }

  return response.json();
}