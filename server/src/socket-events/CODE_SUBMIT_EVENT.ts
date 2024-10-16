import { AppDataSource } from "../data-source";
import { CodeSubmitDTO } from "../dto/SocketEventsDTO";
import { CodeSnippet } from "../entity/CodeSnippet";
import { UserSession } from "../entity/UserSession";

export const eventHandler = async (eventData: CodeSubmitDTO) => {
  const { socket, sessionToken, code, username } = eventData;
  const userSessionRepository = AppDataSource.getRepository(UserSession);

  try {
    const newCodeSnippet = CodeSnippet.create({
      content: code,
      createdAt: new Date(),
    });

    await newCodeSnippet.save();

    const userSession = await userSessionRepository.findOne({
      where: { session: { token: sessionToken }, user: { username } },
      relations: ["user", "session", "codeSnippet"],
    });

    if (!userSession) {
      console.error("User session not found!");
      return;
    }

    userSession.codeSnippet = newCodeSnippet;
    await userSession.save();

    socket.broadcast.emit(`CODE_SUBMIT_${sessionToken}`, {
      code,
      username,
    });
  } catch (error) {
    console.error("Error submitting code:", error);
  }
};
