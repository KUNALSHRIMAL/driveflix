const normalizeTitle = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const editDistance = (left: string, right: string) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex++) {
    const current = [leftIndex];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex++) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] +
          (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
};

export const matchesMovieTitle = (title: string, query: string) => {
  const normalizedTitle = normalizeTitle(title);
  const normalizedQuery = normalizeTitle(query);
  if (!normalizedQuery || normalizedTitle.includes(normalizedQuery)) return true;

  const queryWords = normalizedQuery.split(" ");
  const titleWords = normalizedTitle.split(" ");

  return queryWords.every((queryWord) =>
    titleWords.some((titleWord) => {
      const allowedDistance =
        queryWord.length >= 8 ? 2 : queryWord.length >= 4 ? 1 : 0;
      return editDistance(titleWord, queryWord) <= allowedDistance;
    })
  );
};
