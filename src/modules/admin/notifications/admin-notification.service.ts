import { prisma } from '../../../infrastructure/prisma/prisma.client';

export async function notifyAllAdmins(title: string, body: string): Promise<number> {
  const normalizedTitle = title.trim();
  const normalizedBody = body.trim();
  if (!normalizedTitle || !normalizedBody) return 0;

  const admins = await prisma.admin.findMany({
    select: { id: true },
  });
  if (admins.length === 0) return 0;

  const created = await prisma.adminNotification.createMany({
    data: admins.map((admin) => ({
      adminId: admin.id,
      title: normalizedTitle,
      body: normalizedBody,
    })),
  });

  return created.count;
}
