"use client";

import { createTodo } from "@/app/actions/todos";
import { useFormState, useFormStatus } from "react-dom";

import { useEffect, useRef } from "react";

/**
 * per https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#pending-states
 * useFormStatus returns the status for a specific <form>, so it must be defined as a child of the <form> element.
 */
function CreateTodoFormSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className={`bg-primary text-tertiary border border-secondary rounded w-min py-2 px-4 ${pending && "opacity-80"}`}
    >
      Save
    </button>
  );
}

export default function CreateTodoForm() {
  const [formState, formAction] = useFormState(createTodo, {
    errors: {},
    success: false,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
    }
  }, [formState.success]);

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-2 p-4 border-2 border-primary rounded max-w-sm"
      action={formAction}
    >
      <label htmlFor="title">Title</label>
      <input
        className="border border-primary rounded px-2 py-1"
        id="title"
        name="title"
        type="text"
        placeholder="title"
      />
      {!!formState?.errors.title?.length && (
        <p className="text-red-500">{formState.errors.title.join(", ")}</p>
      )}

      <label htmlFor="title">Description</label>
      <input
        className="border border-primary rounded px-2 py-1"
        id="description"
        name="description"
        type="text"
        placeholder="description"
      />
      {!!formState?.errors.description?.length && (
        <p className="text-red-500">
          {formState.errors.description.join(", ")}
        </p>
      )}

      <label htmlFor="title">Due at</label>
      <input
        className="border border-primary rounded px-2 py-1"
        id="due_at"
        name="due_at"
        type="datetime-local"
      />
      {!!formState?.errors.due_at?.length && (
        <p className="text-red-500">{formState.errors.due_at.join(", ")}</p>
      )}

      <input
        id="timezone"
        name="timezone"
        type="hidden"
        value={Intl.DateTimeFormat().resolvedOptions().timeZone}
        readOnly
      />
      {!!formState?.errors.timezone?.length && (
        <p className="text-red-500">{formState.errors.timezone.join(", ")}</p>
      )}

      <CreateTodoFormSubmitButton />
    </form>
  );
}
