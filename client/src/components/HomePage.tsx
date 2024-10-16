"use client";

import { useEffect, useState } from "react";
import HomePageButtons from "./HomePageButtons";
import { useRouter } from "next/navigation";
import { decrypt } from "@/lib/actions/auth.actions";
import { getAllUserSessions } from "@/lib/actions/user-session.actions";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [userSessions, setUserSessions] = useState<UserSession[] | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const jwtFromSession = sessionStorage.getItem("jwt");
      if (!jwtFromSession) {
        router.push("/sign-in");
        return;
      }
      try {
        const decryptedJWT = await decrypt(jwtFromSession);
        setUsername(decryptedJWT.username);

        const userSessions = await getAllUserSessions(decryptedJWT.username);
        setUserSessions(userSessions);
      } catch (error) {
        console.error("Error decrypting session:", error);
        router.push("/sign-in");
      }
    };

    checkSession();
  }, []);

  return (
    <>
      Welcome home
      {username && (
        <HomePageButtons username={username} userSessions={userSessions} />
      )}
    </>
  );
};

export default HomePage;
