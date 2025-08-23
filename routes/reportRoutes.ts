import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db, materialTable, menteeTable } from "../drizzle";

async function getAllMenteesWithMaterials(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await db
      .select({
        menteeId: menteeTable.id,
        firstName: menteeTable.firstName,
        lastName: menteeTable.lastName,
        url: materialTable.url,
        type: materialTable.type,
      })
      .from(menteeTable)
      .innerJoin(materialTable, eq(menteeTable.id, materialTable.menteeId));

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get all mentees with materials");
  }
}

export const reportRoutes = { getAllMenteesWithMaterials };
