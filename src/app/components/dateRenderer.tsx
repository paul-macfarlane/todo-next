"use client";

import { DateTime } from "luxon";

interface DateRendererProps {
  dateISO: string;
  formatOptions?: Intl.DateTimeFormatOptions;
}

/**
 * Client side rendering for ISO date strings
 * @param dateISO
 * @param formatOptions
 * @constructor
 */
const DateRenderer = ({ dateISO, formatOptions }: DateRendererProps) => {
  return (
    <>
      {DateTime.fromISO(dateISO).toLocaleString(
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
};

export default DateRenderer;
