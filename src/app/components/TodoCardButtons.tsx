import { deleteTodo, toggleTodoComplete } from "@/app/actions/todos";
import Image from "next/image";
import IncompleteCheckmarkRounded from "@/app/assets/IncompleteCheckmarkRounded.svg";
import CompleteCheckmarkRounded from "@/app/assets/CompleteCheckmarkRounded.svg";
import DeleteTrashRounded from "@/app/assets/DeleteTrashRounded.svg";
import { Todo } from "@prisma/client";

interface TodoCardActionsProps {
  todo: Todo;
}

export default function TodoCardButtons({ todo }: TodoCardActionsProps) {
  return (
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
  );
}
