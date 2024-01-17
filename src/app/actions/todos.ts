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

export const createTodo = async (
  _prevState: any,
  formData: FormData,
): Promise<CreateTodoState> => {
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
};

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

  const todoToDelete = await db.todo.findUnique({
    where: {
      id: validatedFields.data.todoId,
    },
  });
  if (!todoToDelete) {
    throw new Error("Todo not found");
  }

  if (todoToDelete.user_id !== user.id) {
    throw new Error("Forbidden");
  }

  await db.todo.delete({
    where: {
      id: validatedFields.data.todoId,
    },
  });

  revalidatePath("/");
}