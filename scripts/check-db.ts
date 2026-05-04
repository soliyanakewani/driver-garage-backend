/**
 * Optional local check. Startup runs the same logic from src/core/startup/check-db.ts.
 *
 * Run: npm run db:check
 */
import 'dotenv/config';
import { prisma } from '../src/infrastructure/prisma/prisma.client';
import { runDbConnectivityCheck } from '../src/core/startup/check-db';

void (async () => {
  await runDbConnectivityCheck();
  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
