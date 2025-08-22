import { Request, Response } from "express";

async function getAllMenteesWithMaterials(req: Request, res: Response) {
  try {
    res.send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get all mentees with materials");
  }
}

export const reportRoutes = { getAllMenteesWithMaterials };
