import db from "@/app/db";
import TodoListHeader from "@/app/components/TodoListHeader";
import TodoCard from "@/app/components/TodoCard";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs";
import TodoCardButtons from "@/app/components/TodoCardButtons";
import Spinner from "@/app/assets/Spinner.svg";
import Image from "next/image";
import Link from "next/link";
import TodoDateFilterer from "@/app/components/TodoDateFilterer";
import { headers } from "next/headers";
import { dateFormat, replaceQueryParam } from "@/app/util";
import { z } from "zod";
import { DateTime } from "luxon";

type Status = "incomplete" | "complete";

const statuses: {
  value: Status;
  display: string;
  isDefault: boolean;
}[] = [
  {
    value: "incomplete",
    display: "Incomplete",
    isDefault: true,
  },
  {
    value: "complete",
    display: "Complete",
    isDefault: false,
  },
];

export default function HomePage({
  searchParams,
}: {
  searchParams: { [_key: string]: string | string[] | undefined };
}) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const search = headersList.get("x-search") || "";

  const selectedStatus =
    statuses.find(
      ({ value, isDefault }) =>
        searchParams["status"] === value ||
        (isDefault && searchParams["status"] === undefined),
    ) ?? statuses[0];

  const rawDueBefore = z
    .string()
    .regex(dateFormat)
    .safeParse(searchParams["due_before"]);
  const rawDueAfter = z
    .string()
    .regex(dateFormat)
    .safeParse(searchParams["due_after"]);
  const dueBefore = rawDueBefore.success ? rawDueBefore.data : undefined;
  const dueAfter = rawDueAfter.success ? rawDueAfter.data : undefined;

  return (
    <div className="max-w-xs md:max-w-sm">
      <TodoListHeader />

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 text-xs">
            {statuses.map(({ value, display }) => {
              return (
                <Link
                  className={`rounded h-min p-2 text-xs ${selectedStatus.value === value ? "bg-primary text-white border-secondary border" : "bg-white text-black border-primary border"}`}
                  key={value}
                  href={replaceQueryParam(pathname + search, "status", value)}
                >
                  {display}
                </Link>
              );
            })}
          </div>

          <TodoDateFilterer dueBefore={dueBefore} dueAfter={dueAfter} />

          {search && (
            <Link
              href={"/"}
              className="w-min text-nowrap rounded h-min p-2 text-xs bg-white text-black border-primary border"
            >
              Clear Filters
            </Link>
          )}
        </div>

        <ul className="flex flex-col gap-4">
          <Suspense fallback={<Image src={Spinner} alt="loading" />}>
            <TodoList
              status={selectedStatus.value}
              dueBefore={dueBefore}
              dueAfter={dueAfter}
            />
          </Suspense>
        </ul>
      </div>
    </div>
  );
}

interface TodoListProps {
  status: Status;
  dueBefore?: string;
  dueAfter?: string;
}

async function TodoList({ status, dueBefore, dueAfter }: TodoListProps) {
  const user = await currentUser();

  let dueBeforeDate: Date | undefined = undefined;
  let dueAfterDate: Date | undefined = undefined;
  if (dueBefore || dueAfter) {
    const userInfo = await db.userInfo.findUnique({
      where: {
        user_id: user!.id,
      },
    });
    const timeZone = userInfo?.time_zone ?? "America/New_York";

    if (dueBefore) {
      dueBeforeDate = DateTime.fromISO(dueBefore, {
        zone: timeZone,
      }).toJSDate();
    }

    if (dueAfter) {
      dueAfterDate = DateTime.fromISO(dueAfter, {
        zone: timeZone,
      })
        .plus({ day: 1 })
        .toJSDate();
    }
  }

  const dueAtClause: { lt?: Date; gt?: Date } = {};
  if (dueBeforeDate) {
    dueAtClause.lt = dueBeforeDate;
  }
  if (dueAfterDate) {
    dueAtClause.gt = dueAfterDate;
  }

  const todos = await db.todo.findMany({
    orderBy: {
      due_at: "asc",
    },
    where: {
      user_id: user!.id, // this page is already protected by an auth guard so user should not be null
      completed_at: status === "complete" ? { not: null } : null,
      due_at: dueAtClause,
    },
  });

  return (
    <>
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoCard todo={todo} buttons={<TodoCardButtons todo={todo} />} />
        </li>
      ))}
    </>
  );
}
