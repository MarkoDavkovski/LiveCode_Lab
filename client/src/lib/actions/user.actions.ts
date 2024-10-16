export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export async function signUp(userData: { username: string; password: string }) {
  try {
    const response = await fetch(`http://localhost:5000/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Error during sign-up");
    }

    const resJson = await response.json();
    sessionStorage.setItem("jwt", resJson.token);

    return resJson;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function signIn(userData: { username: string; password: string }) {
  try {
    const response = await fetch("http://localhost:5000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Error during sign-in");
    }
    const resJson = await response.json();
    sessionStorage.setItem("jwt", resJson.token);
    return resJson;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
