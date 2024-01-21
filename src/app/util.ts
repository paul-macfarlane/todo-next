import { DateTime } from "luxon";

export const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

export function toLocaleString(
  dateISOString: string,
  formatOptions?: Intl.DateTimeFormatOptions,
) {
  const dateISO = DateTime.fromISO(dateISOString);
  if (dateISO.invalidReason) {
    return dateISO.invalidReason;
  }

  return dateISO.toLocaleString(
    formatOptions ?? {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

export function addQueryParam(
  currentPath: string,
  key: string,
  value: string,
): string {
  const url = new URL(currentPath, "http://dummy");
  url.searchParams.set(key, value);

  return url.pathname + url.search;
}

export function removeQueryParam(currentPath: string, key: string): string {
  const url = new URL(currentPath, "http://dummy");
  url.searchParams.delete(key);

  return url.pathname + url.search;
}

export function replaceQueryParam(
  currentPath: string,
  key: string,
  value: string,
): string {
  const url = new URL(currentPath, "http://dummy");
  url.searchParams.set(key, value);

  return url.pathname + url.search;
}
