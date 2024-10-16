import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { CodeSnippet } from "./CodeSnippet";
import { Session } from "./Session";

@Entity("user_sessions")
export class UserSession extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Session)
  @JoinColumn({ name: "sessionId" })
  session: Session;

  @ManyToOne(() => CodeSnippet)
  @JoinColumn({ name: "codeSnippetId" })
  codeSnippet: CodeSnippet;

  @Column()
  hasAccess: boolean = true;

  @Column()
  isCreator: boolean = false;
}
