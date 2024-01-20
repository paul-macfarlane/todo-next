import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import db from "@/app/db";

// public is admittedly a somewhat misleading name for the route, since it s a

const userInfoSchema = z.object({
  timeZone: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const validatedFields = userInfoSchema.safeParse(json);
  if (!validatedFields.success) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  const existingUserInfo = await db.userInfo.findUnique({
    where: {
      user_id: user.id,
    },
  });
  if (
    existingUserInfo &&
    existingUserInfo.time_zone !== validatedFields.data.timeZone
  ) {
    await db.userInfo.update({
      where: {
        user_id: user.id,
      },
      data: {
        time_zone: validatedFields.data.timeZone,
      },
    });
  }

  if (!existingUserInfo) {
    await db.userInfo.create({
      data: {
        user_id: user.id,
        time_zone: validatedFields.data.timeZone,
      },
    });
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
}
