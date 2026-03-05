import { AccountStatus } from "@prisma/client";
import { User } from "../types/User";

export interface UserRepository {
  findAll( 
    search?: string,
    page?: number,
    limit?: number
): Promise<User[]>;
  updateStatus(userId: string, role: string, status: AccountStatus): Promise<void>;
  delete(userId: string, role: string): Promise<void>;

  getStats(): Promise<{
  total: number;
  active: number;
  warned: number;
  blocked: number;
}>;
}


