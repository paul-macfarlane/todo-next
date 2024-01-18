"use client";

import { ChangeEvent, useState } from "react";
import { Todo } from "@prisma/client";
import { editTodoTitle } from "@/app/actions/todos";
import useDebounce from "@/app/hooks/useDebounce";

interface EditTodoTitleFormProps {
  todo: Todo;
}

export default function EditTodoTitleForm({ todo }: EditTodoTitleFormProps) {
  const [title, setTitle] = useState(todo.title);

  const debouncedSubmission = useDebounce(() => {
    const formData = new FormData();
    formData.set("todo_id", todo.id);
    formData.set("title", title);

    void editTodoTitle(formData);
  });

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== title) {
      setTitle(value);

      if (value.length) {
        debouncedSubmission();
      }
    }
  };

  return (
    <input
      className={`inherit-bg focus:outline-none text-xl font-bold placeholder:text-gray-700`}
      type="text"
      id="title"
      name="Title"
      value={title}
      placeholder="title"
      onChange={onTitleChange}
    />
  );
}
