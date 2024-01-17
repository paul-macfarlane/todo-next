import db from "@/app/db";
import DateRenderer from "@/app/components/DateRenderer";
import TodoListHeader from "@/app/components/TodoListHeader";
import Image from "next/image";
import DeleteTrashRounded from "@/app/assets/DeleteTrashRounded.svg";
import { deleteTodo } from "@/app/actions/todos";
import { Todo } from "@prisma/client";

interface TodoCardProps {
  todo: Todo;
}

function TodoCard({ todo }: TodoCardProps) {
  return (
    <li
      className="border-2 border-primary rounded p-4 shadow bg-secondary flex flex-col gap-2"
      key={todo.id}
    >
      <div className="flex justify-between">
        <h3>{todo.title}</h3>

        <div className="w-8 h-8 text-right">
          <form action={deleteTodo}>
            <input type="hidden" id="todo_id" name="todo_id" value={todo.id} />
            <button className="w-6 h-6 hover:h-7 hover:w-7">
              <Image src={DeleteTrashRounded} alt="hide form" />
            </button>
          </form>
        </div>
      </div>

      {!!todo.description?.length && <p>{todo.description}</p>}

      <p className="text-xs">
        Due <DateRenderer dateISOString={todo.due_at.toISOString()} />
      </p>

      {todo.completed_at && (
        <p className="text-xs">
          Completed{" "}
          <DateRenderer dateISOString={todo.completed_at.toISOString()} />
        </p>
      )}
    </li>
  );
}

export default async function HomePage() {
  const todos = await db.todo.findMany();
  // TODO should add error handling eventually

  return (
    <div className="max-w-sm">
      <TodoListHeader />

      <ul className="flex flex-col gap-4">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
