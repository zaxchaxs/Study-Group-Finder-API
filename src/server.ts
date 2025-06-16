import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

initSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});