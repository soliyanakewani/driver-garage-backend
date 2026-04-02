import { AccountStatus } from '@prisma/client';

export interface Garage {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: AccountStatus;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  businessDocumentUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}