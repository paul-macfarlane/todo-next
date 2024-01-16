"use client";

import { DateTime } from "luxon";

interface DateRendererProps {
  dateISOString: string;
  formatOptions?: Intl.DateTimeFormatOptions;
}

/**
 * Client side rendering for ISO date strings
 * @param dateISO
 * @param formatOptions
 * @constructor
 */
export default function DateRenderer({
  dateISOString,
  formatOptions,
}: DateRendererProps) {
  const dateISO = DateTime.fromISO(dateISOString);
  if (dateISO.invalidReason) {
    return <>{dateISO.invalidReason.toString()}</>;
  }

  return (
    <>
      {dateISO.toLocaleString(
        formatOptions ?? {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        },
      )}
    </>
  );
}
