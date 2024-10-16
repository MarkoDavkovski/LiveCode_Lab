import { SERVER_API_URL } from "../../../config";

export const joinOrCreateUserSession = async (
  username: string,
  token: string
): Promise<UserSession | null> => {
  const requestBody: JoinOrCreateUserSessionDTO = { username, token };
  try {
    const response = await fetch(`${SERVER_API_URL}/user-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 404) {
      const errorData = await response.json();
      if (errorData.message === "User not found.") {
        console.error("Error: User not found.");
        alert("User not found.");
      } else if (errorData.message === "Session not found.") {
        console.error("Error: Session not found.");
        alert("Session not found.");
      }
      return null;
    }

    if (response.status === 403) {
      const errorData = await response.json();
      if (errorData.message === "User does not have access.") {
        console.error("Error: User does not have access.");
        alert("You do not have access to this session.");
      }
      return null;
    }

    if (!response.ok) {
      console.error("Error: Failed to join session.", response.statusText);
      alert("Failed to join session. Please try again.");
      return null;
    }

    const userSession = await response.json();
    return userSession as UserSession;
  } catch (error) {
    console.error("Error creating or joining user session:", error);
    alert("An unexpected error occurred. Please try again.");
    return null;
  }
};

export const getAllUserSessions = async (
  username: string
): Promise<UserSessionResponseDTO | null> => {
  try {
    const response = await fetch(
      `${SERVER_API_URL}/user-sessions/user/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user sessions.");
    }

    const sessions = await response.json();
    return sessions as UserSession[];
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return null;
  }
};

export const getUserSessionDetails = async (
  token: string
): Promise<UserSessionDetailsResponseDTO | null> => {
  try {
    const response = await fetch(`${SERVER_API_URL}/user-sessions/${token}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user session details.");
    }

    const userSessionDetails = await response.json();

    return userSessionDetails as UserSessionDetailsResponseDTO;
  } catch (error) {
    console.error("Error fetching user session details:", error);
    return null;
  }
};
