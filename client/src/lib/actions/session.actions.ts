import { SERVER_API_URL } from "../../../config";

export const createSession = async (
  username: string,
  name: string,
  language: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${SERVER_API_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        name,
        language,
      }),
    });

    if (!response.ok) throw new Error("Failed to create session");

    const token = await response.json();
    return token as string;
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
};
