export interface JoinOrCreateUserSessionDTO {
  username: string;
  token: string;
}

export interface UserSessionResponseDTO {
  id: number;
  user: {
    id: number;
    username: string;
  };
  session: {
    id: number;
    token: string;
    name: string;
  };
  hasAccess: boolean;
  isCreator: boolean;
}

export interface UserSessionDetailsResponseDTO {
  session: {
    id: number;
    token: string;
  };
  userSessions: UserSessionResponseDTO[];
  codeSnippet?: {
    id: number;
    content: string;
    createdAt: Date;
  } | null;
}
