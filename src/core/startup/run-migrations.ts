import { execSync } from 'child_process';

const RESOLVE_MIGRATION = '20260421142000_add_post_reports';

function execOutput(cmd: string, cwd: string, env: NodeJS.ProcessEnv): { ok: boolean; stderr: string } {
  try {
    execSync(cmd, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
    return { ok: true, stderr: '' };
  } catch (e: unknown) {
    return { ok: false, stderr: getExecStderr(e) };
  }
}

function getExecStderr(err: unknown): string {
  if (!err || typeof err !== 'object') return '';
  const o = err as { stderr?: Buffer; output?: (Buffer | null)[] };
  if (Buffer.isBuffer(o.stderr)) return o.stderr.toString('utf8');
  if (Array.isArray(o.output) && o.output[2] && Buffer.isBuffer(o.output[2])) {
    return o.output[2].toString('utf8');
  }
  return '';
}

/**
 * Best-effort migration repair + deploy on process startup (no Render Shell / release command).
 * Skips `migrate deploy` when `migrate status` reports DB already in sync (faster cold starts).
 * Never throws — failures are logged only so the HTTP server can still start.
 */
export async function runMigrationsOnStartup(): Promise<void> {
  console.log('[startup-migrations] starting');
  const cwd = process.cwd();
  const env = process.env as NodeJS.ProcessEnv;

  try {
    const resolveCmd = `npx prisma migrate resolve --applied ${RESOLVE_MIGRATION}`;
    const r = execOutput(resolveCmd, cwd, env);
    if (r.ok) {
      console.log(`[startup-migrations] resolve --applied ${RESOLVE_MIGRATION}: ok`);
    } else if (
      r.stderr.includes('P3008') ||
      r.stderr.toLowerCase().includes('already recorded as applied')
    ) {
      console.log(`[startup-migrations] resolve ${RESOLVE_MIGRATION}: already applied (P3008), ok`);
    } else {
      console.warn('[startup-migrations] resolve (non-fatal):', r.stderr.slice(0, 800));
    }

    let needsDeploy = true;
    try {
      execSync('npx prisma migrate status', { cwd, env, stdio: 'ignore' });
      needsDeploy = false;
      console.log('[startup-migrations] migrate status: in sync, skipping deploy');
    } catch {
      needsDeploy = true;
    }

    if (needsDeploy) {
      execSync('npx prisma migrate deploy', { cwd, env, stdio: 'inherit' });
      console.log('[startup-migrations] migrate deploy: ok');
    }
  } catch (e: unknown) {
    console.error('[startup-migrations] error:', e instanceof Error ? e.message : String(e));
  }

  console.log('[startup-migrations] done');
}
