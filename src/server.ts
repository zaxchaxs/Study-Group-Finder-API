import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket";
import prisma from "./configs/prismaClient";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const checkDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Database tersambung");
  } catch (error) {
    console.log("Database belum tersambung");
    process.exit(1);
  }
}

checkDatabase()

initSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});