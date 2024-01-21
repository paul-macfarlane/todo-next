"use client";

import {
  createTodo,
  CreateTodoState,
  CreateTodoStateErrors,
} from "@/app/actions/todos";
import { useFormState, useFormStatus } from "react-dom";

import { RefObject, useEffect, useRef, useState } from "react";

interface CreateTodoFormSubmitButtonProps {
  formRef: RefObject<HTMLFormElement>;
  formState: CreateTodoState;
}

/**
 * per https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#pending-states
 * useFormStatus returns the status for a specific <form>, so it must be defined as a child of the <form> element.
 */
function CreateTodoFormSubmitButton({
  formRef,
  formState,
}: CreateTodoFormSubmitButtonProps) {
  const formStatus = useFormStatus();

  useEffect(() => {
    if (formState.success && !formStatus.pending) {
      formRef.current?.reset();
    }

    // refs don't need to be dependencies of useEffects, so for once we can actually ignore this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.success, formStatus.pending]);

  return (
    <button
      type="submit"
      disabled={formStatus.pending}
      className={`bg-primary text-tertiary border border-secondary rounded w-min p-2 ${formStatus.pending && "opacity-80"}`}
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

  // for the record I hate that I need to store the errors separately, but this is needed because there is no way to reset the formState from useFormState in the client
  const [formErrors, setFormErrors] = useState<CreateTodoStateErrors>();
  useEffect(() => {
    setFormErrors(formState.errors);
  }, [formState.errors]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-2 p-4 border-2 border-primary rounded max-w-xs md:max-w-sm text-xs"
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
      {!!formErrors?.title?.length && (
        <p className="text-red-500">{formErrors?.title.join(", ")}</p>
      )}

      <label htmlFor="title">Description</label>
      <input
        className="border border-primary rounded px-2 py-1"
        id="description"
        name="description"
        type="text"
        placeholder="description"
      />
      {!!formErrors?.description?.length && (
        <p className="text-red-500">{formErrors?.description.join(", ")}</p>
      )}

      <label htmlFor="title">Due at</label>
      <input
        className="border border-primary rounded px-2 py-1"
        id="due_at"
        name="due_at"
        type="datetime-local"
      />
      {!!formErrors?.due_at?.length && (
        <p className="text-red-500">{formErrors?.due_at.join(", ")}</p>
      )}

      <div className="flex gap-2">
        <CreateTodoFormSubmitButton formRef={formRef} formState={formState} />

        <button
          type="button"
          className="bg-white border border-primary rounded w-min p-2"
          onClick={() => {
            formRef.current?.reset();
            setFormErrors({});
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
