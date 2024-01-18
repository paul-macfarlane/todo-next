"use client";

import { Todo } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import useDebounce from "@/app/hooks/useDebounce";
import { editTodo } from "@/app/actions/todos";

interface EditTodoFormProps {
  todo: Todo;
}

// TODO this might eventually be merged with the EditTodoTitleForm and CreateTodoForm
export default function EditTodoForm({ todo }: EditTodoFormProps) {
  const [inputData, setInputData] = useState({
    description: todo.description ?? "",
    due_at: todo.due_at.toISOString().slice(0, 16), // formats date as as YYYY-MM-DDThh:mm in the current timezone
  });

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const debouncedSubmission = useDebounce(() => {
    const formData = new FormData();
    formData.set("todo_id", todo.id);
    formData.set("description", inputData.description);
    formData.set("due_at", inputData.due_at);
    formData.set("timezone", timezone);

    void editTodo(formData);
  });

  const onDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value !== inputData.description) {
      setInputData({ ...inputData, description: value });

      if (value.length) {
        debouncedSubmission();
      }
    }
  };

  const onDueAtChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value !== inputData.due_at) {
      setInputData({ ...inputData, due_at: value });

      if (value.length) {
        debouncedSubmission();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        className={`inherit-bg focus:outline-none placeholder:text-gray-700 text-xs pb ${inputData.description ? "border-b border-b-transparent" : "border-b border-b-gray-700"}`}
        type="text"
        id="description"
        name="description"
        value={inputData.description}
        placeholder="add description"
        onChange={onDescriptionChange}
      />

      <div className="flex items-center gap-1 text-xs">
        <label htmlFor="due_at">Due</label>
        <input
          className="inherit-bg focus:outline-none"
          id="due_at"
          name="due_at"
          type="datetime-local"
          value={inputData.due_at}
          onChange={onDueAtChange}
        />
      </div>
    </div>
  );
}
