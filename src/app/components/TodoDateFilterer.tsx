"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback } from "react";

interface TodoDateFiltererProps {
  dueBefore?: string;
  dueAfter?: string;
}

export default function TodoDateFilterer({
  dueBefore,
  dueAfter,
}: TodoDateFiltererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const onDateChange = (
    e: ChangeEvent<HTMLInputElement>,
    paramName: string,
  ) => {
    router.push(pathname + "?" + createQueryString(paramName, e.target.value));
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 text-xs w-min items-end">
      <div className="flex gap-1 items-center w-full md:w-fit justify-between md:justify-start">
        <label className="text-nowrap" htmlFor="due_before">
          Due before
        </label>

        <input
          id="due_before"
          name="due_before"
          type="date"
          value={dueBefore ?? ""}
          className="border border-primary rounded px-2 py-1"
          onChange={(e) => onDateChange(e, "due_before")}
        />
      </div>

      <div className="flex gap-1 items-center w-full md:w-fit justify-between md:justify-start">
        <label className="text-nowrap" htmlFor="due_before">
          Due after
        </label>

        <input
          id="due_after"
          name="due_after"
          type="date"
          value={dueAfter ?? ""}
          className="border border-primary rounded px-2 py-1"
          onChange={(e) => onDateChange(e, "due_after")}
        />
      </div>
    </div>
  );
}
