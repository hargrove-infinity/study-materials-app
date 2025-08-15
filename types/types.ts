import { db } from "../drizzle";

export enum MaterialTypeEnum {
  ARTICLE = "ARTICLE",
  VIDEO = "VIDEO",
  COURSE = "COURSE",
  IMAGE = "IMAGE",
  DOCUMENTATION = "DOCUMENTATION",
  BOOK = "BOOK",
  OTHER = "OTHER",
}

type DatabaseType = typeof db;

export type TransactionType = Parameters<
  Parameters<DatabaseType["transaction"]>[0]
>[0];
