import { AccountStatus } from '@prisma/client';

export interface Garage {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}