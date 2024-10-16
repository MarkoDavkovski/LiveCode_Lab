import { SignJWT, jwtVerify } from "jose";

// const secret = process.env.JWT_SECRET_KEY; ! - this was not getting the value from .env.local

const secret = "3f5a1d7e2b9f5e5c0d07a531aa6e1d7e"; // I am aware that secret token should belong to .env files.
const key = new TextEncoder().encode(secret);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("exp")) {
      throw new Error("JWT expired");
    } else {
      throw new Error("JWT decryption failed");
    }
  }
}

export const handleLogout = async () => {
  try {
    sessionStorage.removeItem("jwt");
    window.location.replace("/sign-in");
    return true;
  } catch (error) {
    return null;
  }
};
