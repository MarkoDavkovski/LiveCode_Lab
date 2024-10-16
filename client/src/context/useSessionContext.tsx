"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserSessionDetails } from "@/lib/actions/user-session.actions";
import { useParams } from "next/navigation";

import { decrypt } from "@/lib/actions/auth.actions";

const UserSessionContext = createContext<UserSessionContextValue>({
  userSession: null,
  session: null,
  currentUsername: null,
  codeSnippet: null,
});

export const useUserSession = () => useContext(UserSessionContext);

export const UserSessionProvider: React.FC<UserSessionProviderProps> = ({
  children,
}) => {
  const [userSession, setUserSession] = useState<UserSession[] | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [codeSnippet, setCodeSnippet] = useState<CodeSnippet | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  const params = useParams();
  const sessionToken = params.sessionToken as string;

  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (isFetched) return;
    const fetchUserSession = async () => {
      const res = await getUserSessionDetails(sessionToken);
      if (res) {
        setUserSession(res.userSessions);
        setSession(res.session);
        setCodeSnippet(res.codeSnippet || null);
      }

      const jwtFromSession = sessionStorage.getItem("jwt");
      if (jwtFromSession) {
        try {
          const decryptedJWT = await decrypt(jwtFromSession);
          setCurrentUsername(decryptedJWT.username);
        } catch (error) {
          const errorMessage = (error as Error).message;
          if (errorMessage === "JWT expired") {
            alert("Your login session has expired. Please log in again.");
          } else {
            console.error("Error decrypting JWT:", error);
          }
          sessionStorage.removeItem("jwt");
          window.location.replace("/sign-in");
        }
      }
      setIsFetched(true);
    };

    fetchUserSession();
  }, [sessionToken]);

  return (
    <UserSessionContext.Provider
      value={{ userSession, session, currentUsername, codeSnippet }}>
      {children}
    </UserSessionContext.Provider>
  );
};
