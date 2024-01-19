"use server";

import { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import { DateTime } from "luxon";
import { revalidatePath } from "next/cache";
import db from "@/app/db";

/**
 * Format YYYY-MM-DDThh:mm (needed because date-local inputs send in this format)
 */
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

interface CreateTodoState {
  errors: {
    timezone?: string[];
    due_at?: string[];
    title?: string[];
    description?: string[];
  };
  success: boolean;
}

const createTodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  due_at: z.string().regex(dateTimeRegex, {
    message: "Invalid date-time format. Required format: YYYY-MM-DDThh:mm",
  }),
  timezone: z.string(),
});

export async function createTodo(
  _prevState: any,
  formData: FormData,
): Promise<CreateTodoState> {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const validatedFields = createTodoSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    due_at: formData.get("due_at"),
    timezone: formData.get("timezone"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const due_at = DateTime.fromISO(validatedFields.data.due_at, {
    zone: validatedFields.data.timezone,
  });
  if (due_at.invalidReason) {
    return {
      errors: {
        timezone: [due_at.invalidReason.toString()],
      },
      success: false,
    };
  }

  await db.todo.create({
    data: {
      title: validatedFields.data.title,
      description: validatedFields.data.description ?? null,
      due_at: due_at.toJSDate(),
      user_id: user.id,
    },
  });

  revalidatePath("/");

  return {
    errors: {},
    success: true,
  };
}

const todoIdSchema = z.object({
  todoId: z.string(),
});

export async function deleteTodo(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const validatedFields = todoIdSchema.safeParse({
    todoId: formData.get("todo_id"),
  });
  if (!validatedFields.success) {
    throw new Error("Bad Request");
  }

  const todo = await db.todo.findUnique({
    where: {
      id: validatedFields.data.todoId,
    },
  });
  if (!todo) {
    throw new Error("Todo not found");
  }

  if (todo.user_id !== user.id) {
    throw new Error("Forbidden");
  }

  await db.todo.delete({
    where: {
      id: validatedFields.data.todoId,
    },
  });

  revalidatePath("/");
}

export async function toggleTodoComplete(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const validatedFields = todoIdSchema.safeParse({
    todoId: formData.get("todo_id"),
  });
  if (!validatedFields.success) {
    throw new Error("Bad Request");
  }

  const todo = await db.todo.findUnique({
    where: {
      id: validatedFields.data.todoId,
    },
  });
  if (!todo) {
    throw new Error("Todo not found");
  }

  if (todo.user_id !== user.id) {
    throw new Error("Forbidden");
  }

  await db.todo.update({
    where: {
      id: validatedFields.data.todoId,
    },
    data: {
      completed_at: todo.completed_at ? null : new Date(),
    },
  });

  revalidatePath("/");
}

const editTodoSchema = z.object({
  todoId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  due_at: z.string().regex(dateTimeRegex, {
    message: "Invalid date-time format. Required format: YYYY-MM-DDThh:mm",
  }),
  timezone: z.string(),
});

export async function editTodo(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const validatedFields = editTodoSchema.safeParse({
    todoId: formData.get("todo_id"),
    title: formData.get("title"),
    description: formData.get("description"),
    due_at: formData.get("due_at"),
    timezone: formData.get("timezone"),
  });
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    throw new Error("Bad Request");
  }

  const due_at = DateTime.fromISO(validatedFields.data.due_at, {
    zone: validatedFields.data.timezone,
  });
  if (due_at.invalidReason) {
    throw new Error("Bad Request");
  }

  const todo = await db.todo.findUnique({
    where: {
      id: validatedFields.data.todoId,
    },
  });
  if (!todo) {
    throw new Error("Todo not found");
  }

  if (todo.user_id !== user.id) {
    throw new Error("Forbidden");
  }

  if (
    validatedFields.data.title !== todo.title ||
    due_at.toJSDate() !== todo.due_at ||
    validatedFields.data.description !== todo.description
  ) {
    await db.todo.update({
      where: {
        id: validatedFields.data.todoId,
      },
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        due_at: due_at.toJSDate(),
      },
    });
  }

  // purposefully not revalidating path because the only context in which this is used is with requests debouncing
  // id this needs to be called in other contexts that we want to revalidate the path in we can add that as a parameter
}
