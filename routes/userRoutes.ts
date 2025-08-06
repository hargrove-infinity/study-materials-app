import { Request, Response } from "express";
import { db, userTable } from "../drizzle";
import { queryParamsIdSchema, userDefSchema } from "../validation";

// Users endpoints

// Create one user
async function createOneUser(
  req: Request<{}, {}, unknown>,
  res: Response
): Promise<void> {
  try {
    const body = req.body;
    const parsedBody = userDefSchema.parse(body);

    const result = await db.insert(userTable).values(parsedBody).returning();
    const user = result[0];

    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in create one user");
  }
}

async function createOneUserReferred(
  req: Request<unknown, {}, unknown>,
  res: Response
) {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const body = req.body;
    const parsedBody = userDefSchema.parse(body);

    const result = await db
      .insert(userTable)
      .values({ ...parsedBody, referredByUserId: id })
      .returning();

    const user = result[0];

    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in create one user referred");
  }
}

export const userRoutes = { createOneUser, createOneUserReferred } as const;
