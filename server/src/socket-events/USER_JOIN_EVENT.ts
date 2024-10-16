import { UserJoinDTO } from "../dto/SocketEventsDTO";

export const eventHandler = (eventData: UserJoinDTO) => {
  const { socket, sessionToken, username } = eventData;

  socket.broadcast.emit(`USER_JOIN_${sessionToken}`, { username });
};
