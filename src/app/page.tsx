import db from "@/app/db";
import TodoListHeader from "@/app/components/TodoListHeader";
import TodoCard from "@/app/components/TodoCard";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs";
import TodoCardButtons from "@/app/components/TodoCardButtons";
import Spinner from "@/app/assets/Spinner.svg";
import Image from "next/image";
import Link from "next/link";

// TODO this might need to be refactored if we want to allow > 1 filter at a time
const filters = [
  {
    filter: "active",
    display: "Active",
    isDefault: true,
  },
  {
    filter: "completed",
    display: "Completed",
    isDefault: false,
  },
];

export default function HomePage({
  searchParams,
}: {
  searchParams: { [_key: string]: string | string[] | undefined };
}) {
  const currentFilter =
    filters.find(
      ({ filter, isDefault }) =>
        searchParams["filter"] === filter ||
        (isDefault && searchParams["filter"] === undefined),
    ) ?? filters[0];

  return (
    <div className="max-w-sm">
      <TodoListHeader />

      <div className="space-y-4">
        <div className="flex gap-2">
          {filters.map(({ filter, display }) => {
            return (
              <Link
                className={`rounded p-2 text-xs ${currentFilter.filter === filter ? "bg-primary text-white" : "bg-white text-black border-primary border"}`}
                key={filter}
                href={`/?filter=${filter}`}
              >
                {display}
              </Link>
            );
          })}
        </div>

        <ul className="flex flex-col gap-4">
          <Suspense fallback={<Image src={Spinner} alt="loading" />}>
            <TodoList completed={currentFilter.filter === "completed"} />
          </Suspense>
        </ul>
      </div>
    </div>
  );
}

interface TodoListProps {
  completed: boolean;
}

async function TodoList({ completed }: TodoListProps) {
  const user = await currentUser();

  const todos = await db.todo.findMany({
    orderBy: {
      due_at: "asc",
    },
    where: {
      user_id: user!.id, // this page is already protected by an authguard so user should not be null
      completed_at: completed ? { not: null } : null,
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
