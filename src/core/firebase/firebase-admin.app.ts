import admin from 'firebase-admin';

let app: admin.app.App | null = null;

/**
 * Normalizes FIREBASE_PRIVATE_KEY from Render / .env (literal \\n, quotes, CRLF, missing PEM newlines).
 */
export function normalizeFirebasePrivateKey(raw: string | undefined): string {
  if (!raw) return '';

  let k = raw.replace(/^\uFEFF/, '').trim();

  // Strip wrapping double quotes (possibly repeated / JSON-style)
  while (k.length >= 2 && k.startsWith('"') && k.endsWith('"')) {
    k = k.slice(1, -1).trim();
  }
  // Strip wrapping single quotes
  while (k.length >= 2 && k.startsWith("'") && k.endsWith("'")) {
    k = k.slice(1, -1).trim();
  }

  // Literal escaped sequences (order: \\r\\n before \\n so we do not leave stray \\r)
  k = k.replace(/\\r\\n/g, '\n');
  k = k.replace(/\\n/g, '\n');

  // Real CRLF / lone CR → normalize then strip any remaining \r
  k = k.replace(/\r\n/g, '\n');
  k = k.replace(/\r/g, '');

  // Missing newline after BEGIN (body starts immediately)
  k = k.replace(/-----BEGIN PRIVATE KEY-----(?=[^\n-])/g, '-----BEGIN PRIVATE KEY-----\n');
  // Missing newline before END (body glued to END marker)
  k = k.replace(/([^-\n])-----END PRIVATE KEY-----/g, '$1\n-----END PRIVATE KEY-----');

  return k.trim();
}

export function getFirebaseAdminApp(): admin.app.App {
  if (app) {
    return app;
  }
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = normalizeFirebasePrivateKey(rawKey);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY (use \\n for newlines in .env).'
    );
  }

  const rawPreview = (rawKey ?? '').slice(0, 50);
  const normPreview = privateKey.slice(0, 50);
  const hasRealNewline = privateKey.includes('\n');
  console.log('[firebase-admin] FIREBASE_PRIVATE_KEY raw (first 50 chars):', JSON.stringify(rawPreview));
  console.log('[firebase-admin] normalized key (first 50 chars):', JSON.stringify(normPreview));
  console.log('[firebase-admin] normalized key contains real newline:', hasRealNewline);

  if (admin.apps.length > 0) {
    app = admin.app();
    return app;
  }

  try {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (err: unknown) {
    const detail = err instanceof Error ? `${err.name}: ${err.message}\n${err.stack ?? ''}` : String(err);
    console.error('[firebase-admin] initializeApp failed:', detail);
    throw new Error(
      'Firebase Admin failed to initialize (invalid PEM or credentials). Check FIREBASE_PRIVATE_KEY format in Render logs above (raw vs normalized previews).'
    );
  }
  return app;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  const firebaseApp = getFirebaseAdminApp();
  return firebaseApp.auth().verifyIdToken(idToken);
}
