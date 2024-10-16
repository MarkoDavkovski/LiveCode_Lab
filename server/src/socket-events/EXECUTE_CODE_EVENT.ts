import { ExecuteCodeDTO } from "../dto/SocketEventsDTO";

export const eventHandler = (eventData: ExecuteCodeDTO) => {
  const { socket, code, sessionToken } = eventData;

  socket.broadcast.emit(`EXECUTE_CODE_${sessionToken}`, {
    code,
  });
};
