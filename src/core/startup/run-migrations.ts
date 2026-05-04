import { execSync } from 'child_process';

const RESOLVE_MIGRATION = '20260421142000_add_post_reports';

/**
 * Best-effort migration repair + deploy on process startup (no Render Shell / release command).
 * Never throws — failures are logged only so the HTTP server can still start.
 */
export async function runMigrationsOnStartup(): Promise<void> {
  console.log('[startup-migrations] starting');
  const cwd = process.cwd();
  const env = process.env as NodeJS.ProcessEnv;

  try {
    try {
      execSync(`npx prisma migrate resolve --applied ${RESOLVE_MIGRATION}`, {
        cwd,
        env,
        stdio: 'inherit',
      });
      console.log(`[startup-migrations] resolve --applied ${RESOLVE_MIGRATION}: ok`);
    } catch (resolveErr: unknown) {
      console.warn(
        '[startup-migrations] resolve (non-fatal):',
        resolveErr instanceof Error ? resolveErr.message : String(resolveErr)
      );
    }

    execSync('npx prisma migrate deploy', { cwd, env, stdio: 'inherit' });
    console.log('[startup-migrations] migrate deploy: ok');
  } catch (e: unknown) {
    console.error('[startup-migrations] error:', e instanceof Error ? e.message : String(e));
  }

  console.log('[startup-migrations] done');
}
