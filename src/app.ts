import path from "path";
import express from "express";
import userRoutes from "./routes/user.route";
import groupchatRoutes from "./routes/groupChat.route";
import privatechatRoutes from "./routes/privatechat.route";
import fileUploadRoutes from "./routes/fileupload.route";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/users", userRoutes);
app.use("/api/groups", groupchatRoutes);
app.use("/api/private-chat", privatechatRoutes);

app.use("/api/upload", fileUploadRoutes);
app.use(express.static(path.join(__dirname, "../public")));

app.use(errorHandler);
export default app;
