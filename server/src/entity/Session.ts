import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @Column()
  name: string;

  @Column()
  language: string;

  @Column()
  executedCode?: string = "";

  @Column()
  isLocked: boolean = false;
}
