import { AccountStatus } from '@prisma/client';
import { prisma } from '../../../../infrastructure/prisma/prisma.client';

export class GarageApprovalService {
    async getAllGarages() {
        return prisma.garage.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async searchGarages(query: string) {
        const q = query.trim();

        const status = Object.values(AccountStatus).includes(q.toUpperCase() as AccountStatus)
            ? (q.toUpperCase() as AccountStatus)
            : undefined;

        return prisma.garage.findMany({
            where: {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    ...(status ? [{ status }] : []),
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getGarageById(id: string) {
        return prisma.garage.findUnique({ where: { id } });
    }

    async approveGarage(id: string) {
        return prisma.garage.update({
        where: { id },
        data: { status: 'ACTIVE' },
        });
    }

    async rejectGarage(id: string) {
        return prisma.garage.update({
        where: { id },
        data: { status: 'REJECTED' }, 
        });
    }
}
