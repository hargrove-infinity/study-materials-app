import { Request, Response } from "express";
import { db, menteeTable } from "../drizzle";
import { menteeDefSchema } from "../validation";

async function createOneMentee(
  req: Request<{}, {}, unknown>,
  res: Response
): Promise<void> {
  try {
    const body = req.body;
    const parsedBody = menteeDefSchema.parse(body);

    const result = await db.insert(menteeTable).values(parsedBody).returning();
    const mentee = result[0];

    res.status(201).send(mentee);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in create one mentee");
  }
}

export const menteeRoutes = { createOneMentee } as const;
