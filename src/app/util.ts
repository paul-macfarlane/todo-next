import { DateTime } from "luxon";

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
