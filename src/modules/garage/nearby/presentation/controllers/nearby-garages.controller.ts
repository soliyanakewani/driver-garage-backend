import { Request, Response } from 'express';
import { prisma } from '../../../../../infrastructure/prisma/prisma.client';

const EARTH_RADIUS_KM = 6371;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const getNearbyGarages = async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radiusKm = parseFloat((req.query.radiusKm as string) ?? '10');

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: 'lat and lng query parameters are required' });
    }
    if (Number.isNaN(radiusKm) || radiusKm <= 0) {
      return res.status(400).json({ error: 'radiusKm must be a positive number' });
    }

    const garages = await prisma.garage.findMany({
      where: {
        status: 'ACTIVE',
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        latitude: true,
        longitude: true,
        services: { select: { id: true, name: true } },
      },
    });

    const nearby = garages
      .map((g) => {
        const distanceKm = haversineKm(lat, lng, g.latitude!, g.longitude!);
        return { ...g, distanceKm: Math.round(distanceKm * 10) / 10 };
      })
      .filter((g) => g.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(nearby);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};
