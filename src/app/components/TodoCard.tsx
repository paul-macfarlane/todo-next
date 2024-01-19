"use client";

import { Todo } from "@prisma/client";
import { deleteTodo, editTodo, toggleTodoComplete } from "@/app/actions/todos";
import Image from "next/image";
import IncompleteCheckmarkRounded from "@/app/assets/IncompleteCheckmarkRounded.svg";
import CompleteCheckmarkRounded from "@/app/assets/CompleteCheckmarkRounded.svg";
import DeleteTrashRounded from "@/app/assets/DeleteTrashRounded.svg";
import { ChangeEvent, useState } from "react";
import useDebounce from "@/app/hooks/useDebounce";
import { toLocaleString } from "@/app/util";
import { DateTime } from "luxon";

interface TodoCardProps {
  todo: Todo;
}

export default function TodoCard({ todo }: TodoCardProps) {
  const [inputData, setInputData] = useState({
    title: todo.title,
    description: todo.description ?? "",
    due_at: DateTime.fromISO(todo.due_at.toISOString())
      .toLocal()
      .toFormat("yyyy-MM-dd'T'HH:mm"),
  });

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const debouncedSubmission = useDebounce(() => {
    const formData = new FormData();

    formData.set("todo_id", todo.id);
    formData.set("title", inputData.title);
    formData.set("description", inputData.description);
    formData.set("due_at", inputData.due_at);
    formData.set("timezone", timezone);

    void editTodo(formData);
  });

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value !== inputData.title) {
      setInputData({ ...inputData, title: value });

      if (value.length) {
        debouncedSubmission();
      }
    }
  };

  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
    <div
      className="border-2 border-primary rounded p-4 shadow bg-secondary flex flex-col gap-2"
      key={todo.id}
    >
      <div className="flex justify-between">
        <input
          className={`inherit-bg focus:outline-none text-xl font-bold placeholder:text-gray-700`}
          type="text"
          id="title"
          name="Title"
          value={inputData.title}
          placeholder="title"
          onChange={onTitleChange}
        />

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

      <div className="flex flex-col gap-4">
        <textarea
          className={`inherit-bg focus:outline-none placeholder:text-gray-700 text-xs`}
          id="description"
          name="description"
          value={inputData.description}
          placeholder="add description"
          onChange={onDescriptionChange}
          rows={3}
        />

        <div className="flex items-center gap-1 text-xs">
          <label htmlFor="due_at">Due</label>
          <input
            className="inherit-bg focus:outline-none"
            id="due_at"
            name="due_at"
            type="datetime-local"
            value={DateTime.fromISO(inputData.due_at)
              .toLocal()
              .toFormat("yyyy-MM-dd'T'HH:mm")}
            onChange={onDueAtChange}
          />
        </div>
      </div>

      {todo.completed_at && (
        <p className="text-xs">
          Completed: {toLocaleString(todo.completed_at.toISOString())}
        </p>
      )}
    </div>
  );
}
