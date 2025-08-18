import { db } from "../drizzle";

type DatabaseType = typeof db;

export type TransactionType = Parameters<
  Parameters<DatabaseType["transaction"]>[0]
>[0];

export type DatabaseOrTransactionType = DatabaseType | TransactionType;
