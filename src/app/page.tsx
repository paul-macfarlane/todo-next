import db from "@/app/db";
import DateRenderer from "@/app/components/DateRenderer";
import TodoListHeader from "@/app/components/TodoListHeader";

const HomePage = async () => {
  const todos = await db.todo.findMany();
  // TODO should add error handling eventually

  return (
    <div className="max-w-sm">
      <TodoListHeader />

      <ul className="flex flex-col gap-4">
        {todos.map((todo) => (
          <li
            className="border-2 border-primary rounded p-4 shadow bg-secondary flex flex-col gap-2"
            key={todo.id}
          >
            <h3>{todo.title}</h3>

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
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
