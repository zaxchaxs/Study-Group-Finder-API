import path from "path";
import express from "express";
import userRoutes from "./routes/user.route";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use(express.static(path.join(__dirname, "../public")));

app.use(errorHandler);
export default app;
