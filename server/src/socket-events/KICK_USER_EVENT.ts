import { AppDataSource } from "../data-source";
import { KickUserDTO } from "../dto/SocketEventsDTO";
import { UserSession } from "../entity/UserSession";

export const eventHandler = async (eventData: KickUserDTO) => {
  const { socket, sessionToken, username, actionedBy } = eventData;
  const userSessionRepository = AppDataSource.getRepository(UserSession);

  const userSession = await userSessionRepository.findOne({
    where: { session: { token: sessionToken }, user: { username: username } },
  });

  const actionedBySession = await userSessionRepository.findOne({
    where: { session: { token: sessionToken }, user: { username: actionedBy } },
  });

  if (userSession && actionedBySession) {
    if (actionedBySession.isCreator) {
      userSession.hasAccess = false;
      await userSession.remove();

      socket.emit(`KICK_USER_${sessionToken}`, { username });
      socket.broadcast.emit(`KICK_USER_${sessionToken}`, { username });
    }
  }
};
