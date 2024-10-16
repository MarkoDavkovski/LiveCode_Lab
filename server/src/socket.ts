import { Server } from "socket.io";
import { EVENT_NAMES, processEvents } from "./socket-events/event-processor";

const socketIo = (server) => {
  return new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
};

export default function initSocket(server) {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("New user connection established:", socket.id);

    EVENT_NAMES.forEach((event) => {
      socket.on(event, async (data) => {
        try {
          await processEvents(event, { socket, ...data });
        } catch (error) {
          console.error(`Error processing event "${event}":`, error);
          socket.emit("error", {
            message: `Failed to process event: ${event}`,
          });
        }
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}
