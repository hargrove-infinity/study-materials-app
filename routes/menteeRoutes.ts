import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db, menteeTable } from "../drizzle";
import {
  menteeDefSchema,
  menteeUpdateSchema,
  queryParamsIdSchema,
} from "../validation";

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

// Get one mentee
async function getOneMentee(
  req: Request<unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const mentee = await db.query.menteeTable.findFirst({
      where: eq(menteeTable.id, id),
    });

    if (!mentee) {
      res.status(400).send(`Mentee with provided id ${id} is not found`);
      return;
    }

    res.send(mentee);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get one mentee");
  }
}

// Update one mentee
async function updateOneMentee(
  req: Request<unknown, {}, unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const mentee = await db.query.menteeTable.findFirst({
      where: eq(menteeTable.id, id),
    });

    if (!mentee) {
      res.status(400).send(`Mentee with provided id ${id} is not found`);
      return;
    }

    const body = req.body;
    const parsedBody = menteeUpdateSchema.parse(body);

    const result = await db
      .update(menteeTable)
      .set(parsedBody)
      .where(eq(menteeTable.id, id))
      .returning();

    const updatedMentee = result[0];

    res.send(updatedMentee);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get one mentee");
  }
}

export const menteeRoutes = {
  createOneMentee,
  getAllMentees,
  getOneMentee,
  updateOneMentee,
} as const;
