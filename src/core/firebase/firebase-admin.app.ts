import admin from 'firebase-admin';

let app: admin.app.App | null = null;

const BEGIN_PKCS8 = '-----BEGIN PRIVATE KEY-----';
const END_PKCS8 = '-----END PRIVATE KEY-----';

/**
 * Normalizes FIREBASE_PRIVATE_KEY from Render / .env:
 * - Literal \\n / \\r\\n (including repeated / double-escaped layers)
 * - Wrapping single/double quotes
 * - Real CRLF and stray \\r
 * - Collapses whitespace inside the base64 body (common paste corruption)
 * - Ensures newlines around PEM boundaries
 */
export function normalizeFirebasePrivateKey(raw: string | undefined): string {
  if (!raw) return '';

  let k = raw.replace(/^\uFEFF/, '').trim();
  k = k.replace(/[\u200B-\u200D\uFEFF]/g, '');

  while (k.length >= 2 && k.startsWith('"') && k.endsWith('"')) {
    k = k.slice(1, -1).trim();
  }
  while (k.length >= 2 && k.startsWith("'") && k.endsWith("'")) {
    k = k.slice(1, -1).trim();
  }

  // Unwind literal escapes (repeat: Render sometimes stores \\n as two chars, or JSON double-escapes)
  for (let i = 0; i < 12; i++) {
    const next = k.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n');
    if (next === k) break;
    k = next;
  }

  k = k.replace(/\r\n/g, '\n').replace(/\r/g, '');

  // PKCS#8 (Firebase service account default): collapse whitespace-only damage in body
  if (k.includes(BEGIN_PKCS8) && k.includes(END_PKCS8)) {
    const i0 = k.indexOf(BEGIN_PKCS8);
    const i1 = k.indexOf(END_PKCS8);
    if (i1 > i0 + BEGIN_PKCS8.length) {
      const body = k.slice(i0 + BEGIN_PKCS8.length, i1).replace(/\s+/g, '');
      k = `${BEGIN_PKCS8}\n${body}\n${END_PKCS8}`;
    }
  }

  k = k.replace(/-----BEGIN PRIVATE KEY-----(?=[^\n-])/g, `${BEGIN_PKCS8}\n`);
  k = k.replace(/([^-\n])-----END PRIVATE KEY-----/g, `$1\n${END_PKCS8}`);

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
      'Firebase Admin failed to initialize (invalid PEM or credentials). Verify FIREBASE_PRIVATE_KEY in your host environment (PEM newlines / service account JSON).'
    );
  }
  return app;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  const firebaseApp = getFirebaseAdminApp();
  return firebaseApp.auth().verifyIdToken(idToken);
}
