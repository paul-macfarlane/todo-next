import db from "@/app/db";
import TodoListHeader from "@/app/components/TodoListHeader";
import TodoCard from "@/app/components/TodoCard";

export default async function HomePage() {
  const todos = await db.todo.findMany({
    orderBy: {
      due_at: "asc",
    },
  });
  // TODO should add error handling eventually

  return (
    <div className="max-w-sm">
      <TodoListHeader />

      <ul className="flex flex-col gap-4">
        {todos.map((todo) => (
          <li key={todo.id}>
            <TodoCard todo={todo} />
          </li>
        ))}
      </ul>
    </div>
  );
}
