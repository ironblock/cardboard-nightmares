import { URI } from "../types/Scryfall/Attributes";
import { CompleteCard } from "../types/Scryfall/Card";

const SCRYFALL_CACHE = "scryfall-cache";

export interface BulkDataEndpoint {
  object: "bulk_data";
  id: string;
  type: BulkDataType;
  updated_at: string;
  uri: URI;
  name: string;
  description: string;
  size: number;
  download_uri: URI;
  content_type: "application/json";
  content_encoding: "gzip";
}

export type BulkDataType =
  | "oracle_cards"
  | "unique_artwork"
  | "default_cards"
  | "all_cards"
  | "rulings";

export interface BulkDataOptionsResponse {
  object: "list";
  has_more: boolean;
  data: BulkDataEndpoint[];
}

export async function getBulkDataOptions(): Promise<BulkDataOptionsResponse> {
  return (await fetch("https://api.scryfall.com/bulk-data"))?.json();
}

export async function getUriForBulkDataType(
  bulkDataType: BulkDataType
): Promise<URI> {
  const bulkDataOptions = await getBulkDataOptions();
  const bulkDataEndpoint = bulkDataOptions.data.find(
    (bulkDataEndpoint) => bulkDataEndpoint.type === bulkDataType
  );
  if (!bulkDataEndpoint) {
    throw new Error(`No bulk data endpoint found for ${bulkDataType}`);
  }
  return bulkDataEndpoint.download_uri;
}

export async function getBulkCardDataByType(
  bulkDataType: BulkDataType
): Promise<CompleteCard[]> {
  const [cache, uri] = await Promise.all([
    caches.open(SCRYFALL_CACHE),
    getUriForBulkDataType(bulkDataType),
  ]);

  cache.add(uri);
  return (await fetch(uri)).json();
}

export async function isBulkCardDataCachedForType(
  bulkDataType: BulkDataType
): Promise<boolean> {
  const [cache, uri] = await Promise.all([
    caches.open(SCRYFALL_CACHE),
    getUriForBulkDataType(bulkDataType),
  ]);

  return Boolean(await cache.match(uri));
}
