import { CodeChangeDTO } from "../dto/SocketEventsDTO";

export const eventHandler = (eventData: CodeChangeDTO) => {
  const { socket, sessionToken, updatedCode, username } = eventData;

  socket.broadcast.emit(`CODE_CHANGE_${sessionToken}`, {
    updatedCode,
    username,
  });

  socket.emit(`CODE_CHANGE_${sessionToken}`, {
    updatedCode,
    username,
  });
};
