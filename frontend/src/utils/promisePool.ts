export async function promisePool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  console.log("promisePool input count", items.length);

  for (let i = 0; i < items.length; i += concurrency) {
    console.log(
      "Processing batch",
      i / concurrency + 1,
      "of",
      Math.ceil(items.length / concurrency)
    );
    const batch = items.slice(i, i + concurrency);
    console.log("promisePool batch size", batch.length);

    const batchResults = await Promise.all(
      batch.map(worker)
    );
    console.log("batchResults length", batchResults.length);
    console.log("promisePool batchResults count", batchResults.length);

    results.push(...batchResults);
    console.log("results length", results.length);
  }

  console.log("Finished all batches", results.length);
  console.log("promisePool final results count", results.length);
  console.log("promisePool returning", results.length);
  return results;
}
