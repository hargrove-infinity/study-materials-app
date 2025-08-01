import express from "express";
import { BaseRouter } from "./routes";

/* SETUP APP */
const app = express();
const jsonMiddleware = express.json();
app.use(jsonMiddleware);
const PORT = 4000;

// API router
app.use(BaseRouter);

/* RUN APP */
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
