import db from "@/app/db";
import TodoListHeader from "@/app/components/TodoListHeader";
import TodoCard from "@/app/components/TodoCard";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs";
import TodoCardButtons from "@/app/components/TodoCardButtons";
import Spinner from "@/app/assets/Spinner.svg";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="max-w-sm">
      <TodoListHeader />

      <ul className="flex flex-col gap-4">
        <Suspense fallback={<Image src={Spinner} alt="loading" />}>
          <TodoList />
        </Suspense>
      </ul>
    </div>
  );
}

async function TodoList() {
  const user = await currentUser();

  const todos = await db.todo.findMany({
    orderBy: {
      due_at: "asc",
    },
    where: {
      user_id: user!.id, // this page is already protected by an authguard so user should not be null
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
