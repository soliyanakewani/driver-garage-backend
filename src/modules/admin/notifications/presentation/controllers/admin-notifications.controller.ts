import { Request, Response } from 'express';
import { prisma } from '../../../../../infrastructure/prisma/prisma.client';

type BroadcastTarget = 'DRIVERS' | 'GARAGES' | 'ALL';

function normalizeTarget(value: unknown): BroadcastTarget {
  const target = String(value ?? '').trim().toUpperCase();
  if (target === 'DRIVERS' || target === 'GARAGES' || target === 'ALL') return target;
  throw new Error('target must be one of: DRIVERS, GARAGES, ALL');
}

export class AdminNotificationsController {
  static async broadcast(req: Request, res: Response) {
    try {
      const title = String(req.body.title ?? '').trim();
      const body = String(req.body.body ?? '').trim();
      const target = normalizeTarget(req.body.target);

      if (!title || !body) {
        res.status(400).json({ error: 'title and body are required' });
        return;
      }

      let driversCount = 0;
      let garagesCount = 0;

      if (target === 'DRIVERS' || target === 'ALL') {
        const drivers = await prisma.driver.findMany({
          where: { status: 'ACTIVE' },
          select: { id: true },
        });
        if (drivers.length > 0) {
          const result = await prisma.driverNotification.createMany({
            data: drivers.map((driver) => ({
              driverId: driver.id,
              title,
              body,
            })),
          });
          driversCount = result.count;
        }
      }

      if (target === 'GARAGES' || target === 'ALL') {
        const garages = await prisma.garage.findMany({
          where: { status: 'ACTIVE' },
          select: { id: true },
        });
        if (garages.length > 0) {
          const result = await prisma.garageNotification.createMany({
            data: garages.map((garage) => ({
              garageId: garage.id,
              title,
              body,
            })),
          });
          garagesCount = result.count;
        }
      }

      res.status(201).json({
        message: 'Broadcast sent',
        target,
        title,
        sent: {
          drivers: driversCount,
          garages: garagesCount,
          total: driversCount + garagesCount,
        },
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
