import { prisma } from '../../infrastructure/prisma/prisma.client';

/**
 * Log DB connectivity and critical tables (Render logs; no Shell required).
 */
export async function runDbConnectivityCheck(): Promise<void> {
  try {
    await prisma.driver.findFirst();
    console.log('[db-check] Driver table: OK (query succeeded)');
  } catch (e: unknown) {
    console.error('[db-check] Driver table FAILED:', e instanceof Error ? e.message : String(e));
  }

  try {
    await prisma.garage.findFirst();
    console.log('[db-check] Garage table: OK (query succeeded)');
  } catch (e: unknown) {
    console.error('[db-check] Garage table FAILED:', e instanceof Error ? e.message : String(e));
  }

  try {
    await prisma.garageSignupOtp.findFirst();
    console.log('[db-check] garageSignupOtp table EXISTS');
  } catch (e: unknown) {
    console.error(
      '[db-check] garageSignupOtp table MISSING:',
      e instanceof Error ? e.message : String(e)
    );
  }
}
