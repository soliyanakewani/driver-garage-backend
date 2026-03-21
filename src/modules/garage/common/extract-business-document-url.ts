import type { Request } from 'express';

/**
 * Business / registration document URL from JSON body or multipart file.
 * Body: businessDocumentUrl, documentUrl, document_url
 * Files: businessDocument, document, registrationDocument → stored under uploads/garages/
 */
export function extractGarageBusinessDocumentUrl(req: Request): string | undefined {
  const files = (req as Request & { files?: Record<string, Express.Multer.File[]> }).files;
  const file =
    files?.businessDocument?.[0] || files?.document?.[0] || files?.registrationDocument?.[0];
  if (file) {
    return `${req.protocol}://${req.get('host')}/uploads/garages/${file.filename}`;
  }

  const body = req.body as Record<string, unknown>;
  const fromBody =
    (typeof body.businessDocumentUrl === 'string' && body.businessDocumentUrl.trim()) ||
    (typeof body.documentUrl === 'string' && body.documentUrl.trim()) ||
    (typeof body.document_url === 'string' && body.document_url.trim());
  if (fromBody) return String(fromBody).trim();

  return undefined;
}
