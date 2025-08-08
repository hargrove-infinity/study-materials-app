import { Request, Response } from "express";
import { db, menteeTable } from "../drizzle";
import { menteeDefSchema } from "../validation";

// Mentees endpoints

// Create one mentee
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

// Get all mentees
async function getAllMentees(req: Request, res: Response): Promise<void> {
  try {
    const mentees = await db.query.menteeTable.findMany();
    res.send(mentees);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get all mentees");
  }
}

export const menteeRoutes = { createOneMentee, getAllMentees } as const;
