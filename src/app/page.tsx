import db from "@/app/db";
import DateRenderer from "@/app/components/DateRenderer";
import TodoListHeader from "@/app/components/TodoListHeader";
import Image from "next/image";
import CompleteCheckmarkRounded from "@/app/assets/CompleteCheckmarkRounded.svg";
import IncompleteCheckmarkRounded from "@/app/assets/IncompleteCheckmarkRounded.svg";
import DeleteTrashRounded from "@/app/assets/DeleteTrashRounded.svg";
import { toggleTodoComplete, deleteTodo } from "@/app/actions/todos";
import { Todo } from "@prisma/client";
import EditTodoForm from "@/app/components/EditTodoForm";
import EditTodoTitleForm from "@/app/components/EditTodoTitleForm";

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
        <EditTodoTitleForm todo={todo} />

        <div className="flex">
          <div className="w-8 h-8 text-right">
            <form action={toggleTodoComplete}>
              <input
                type="hidden"
                id="todo_id"
                name="todo_id"
                value={todo.id}
                readOnly
              />

              <button className="w-6 h-6 hover:h-7 hover:w-7">
                {todo.completed_at && (
                  <Image src={IncompleteCheckmarkRounded} alt="hide form" />
                )}

                {!todo.completed_at && (
                  <Image src={CompleteCheckmarkRounded} alt="hide form" />
                )}
              </button>
            </form>
          </div>

          <div className="w-8 h-8 text-right">
            <form action={deleteTodo}>
              <input
                type="hidden"
                id="todo_id"
                name="todo_id"
                value={todo.id}
                readOnly
              />

              <button className="w-6 h-6 hover:h-7 hover:w-7">
                <Image src={DeleteTrashRounded} alt="hide form" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <EditTodoForm todo={todo} />

      {todo.completed_at && (
        <p className="text-xs">
          Completed:{" "}
          <DateRenderer dateISOString={todo.completed_at.toISOString()} />
        </p>
      )}
    </li>
  );
}

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
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
