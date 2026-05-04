import admin from 'firebase-admin';

let app: admin.app.App | null = null;

/**
 * Render / single-line .env values often store PEM as one line with literal `\n`.
 * Also strip accidental JSON quotes and fix missing newlines around PEM boundaries.
 */
export function normalizeFirebasePrivateKey(raw: string | undefined): string {
  if (!raw) return '';
  let k = raw.replace(/^\uFEFF/, '').trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) {
    k = k.slice(1, -1).trim();
  }
  k = k.replace(/\r\n/g, '\n');
  k = k.replace(/\\r\\n/g, '\n');
  k = k.replace(/\\r/g, '\n');
  k = k.replace(/\\n/g, '\n');
  // If header/body were concatenated without a newline (bad paste)
  k = k.replace(/-----BEGIN PRIVATE KEY-----(?=[^\n\r-])/g, '-----BEGIN PRIVATE KEY-----\n');
  k = k.replace(/([^-\n\r])-----END PRIVATE KEY-----/g, '$1\n-----END PRIVATE KEY-----');
  return k.trim();
}

export function getFirebaseAdminApp(): admin.app.App {
  if (app) {
    return app;
  }
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = normalizeFirebasePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY (use \\n for newlines in .env).'
    );
  }

  if (admin.apps.length > 0) {
    app = admin.app();
    return app;
  }

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
  return app;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  const firebaseApp = getFirebaseAdminApp();
  return firebaseApp.auth().verifyIdToken(idToken);
}
