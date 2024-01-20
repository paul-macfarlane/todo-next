import db from "@/app/db";
import TodoListHeader from "@/app/components/TodoListHeader";
import TodoCard from "@/app/components/TodoCard";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="max-w-sm">
      <TodoListHeader />

      <ul className="flex flex-col gap-4">
        <Suspense fallback={<LoadingSkeleton />}>
          <TodoList />
        </Suspense>
      </ul>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <TodoCard
          key={i}
          todo={{
            id: "",
            user_id: "",
            title: "Title",
            description: "description",
            due_at: new Date(),
            completed_at: null,
          }}
        />
      ))}
    </>
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
          <TodoCard todo={todo} />
        </li>
      ))}
    </>
  );
}
