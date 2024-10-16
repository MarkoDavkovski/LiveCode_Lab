declare interface User {
  id: number;
  username: string;
}

declare interface CodeSnippet {
  id: number;
  content: string;
  createdAt: Date;
}

declare interface Session {
  id: number;
  token: string;
  name: string;
  language: string;
  executedCode?: string;
  isLocked: boolean;
}

declare interface UserSession {
  id: number;
  user: User;
  session: Session;
  codeSnippet: CodeSnippet;
  hasAccess: boolean;
  isCreator: boolean;
}

declare interface JoinOrCreateUserSessionDTO {
  username: string;
  token: string;
}

declare interface UserSessionDetailsResponseDTO {
  session: Session;
  userSessions: UserSession[];
  codeSnippet?: CodeSnippet;
}

declare interface UserSessionContextValue {
  userSession: UserSession[] | null;
  session: Session | null;
  currentUsername: string | null;
  codeSnippet: CodeSnippet | null;
}
declare interface UserSessionProviderProps {
  children: React.ReactNode;
}
declare interface DecryptedPayload {
  username: string;
}

declare interface HomePageButtonsProps {
  username: string;
  userSessions: UserSession[] | null;
}

declare interface FooterProps {
  user: User | null;
}

declare interface DialogButtonProps {
  title: string;
  description: string;
  fields: {
    id: string;
    label: string;
    type?: string;
    defaultValue?: string;
    placeholder?: string;
    component?: React.ReactNode;
  }[];
  buttonText: string;
  onSubmit: () => void;
}

declare type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "csharp"
  | "php";
declare type UserSessionResponseDTO = UserSession[];
