export interface ParsedMovie {
  title: string;
  year?: number;
}

const QUALITY_TAGS = [
  "2160p",
  "1440p",
  "1080p",
  "720p",
  "480p",
  "360p",
  "BluRay",
  "Blu-Ray",
  "BRRip",
  "WEBRip",
  "WEB-DL",
  "HDRip",
  "DVDRip",
  "HDTV",
  "UHD",
  "HEVC",
  "x264",
  "x265",
  "H264",
  "H265",
  "AAC",
  "DD",
  "DDP",
  "DD5",
  "DDP5",
  "HDR",
  "REMUX",
  "Atmos",
  "ESub",
  "ESubs",
  "Multi",
  "Hindi",
  "English",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Dual Audio",
  "YTS",
  "PSA",
  "HDHub4u",
  "Vegamovies",
  "HC",
  "HQ",
  "Studio",
];

export function parseMovieName(fileName: string): ParsedMovie {
  // Remove the video extension.
  let name = fileName.replace(/\.(?:mkv|mp4|avi|mov|m4v|webm)$/i, "");

  // Normalize separators
  name = name.replace(/[._]+/g, " ");

  // Extract year
  const yearMatch = name.match(/\b(19\d{2}|20\d{2})\b/);

  const year = yearMatch ? Number(yearMatch[1]) : undefined;

  // Release metadata conventionally starts at the year. Discarding the
  // suffix avoids leaking codec, source, language, audio, and group tags.
  if (yearMatch) {
    name = name.slice(0, yearMatch.index);
  }

  // Clean release tags from filenames that do not contain a year.
  QUALITY_TAGS.forEach((tag) => {
    const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(
      `\\b${escapedTag.replace(/[ -]+/g, "[\\s-]+")}\\b`,
      "gi"
    );
    name = name.replace(regex, "");
  });

  // Dotted audio tags become values such as "DD5 1" after normalization.
  name = name.replace(/\b(?:DD|DDP)\s*\d(?:\s*\d)?\b/gi, "");

  // Remove empty brackets
  name = name.replace(/[()[\]]/g, "");

  // Remove multiple spaces
  name = name.replace(/\s+/g, " ").trim();

  return {
    title: name,
    year,
  };
}
