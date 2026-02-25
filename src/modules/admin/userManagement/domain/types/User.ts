import { AccountStatus, Role } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  createdAt: Date;
}
