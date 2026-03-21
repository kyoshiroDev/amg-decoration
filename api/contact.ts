import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendContactEmail } from './_contact-handler';

// Vercel serverless function — chargée par convention de fichier, pas par import
// eslint-disable-next-line import/no-unused-modules













export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { status, json } = await sendContactEmail(req.body ?? {});
    res.status(status).json(json);
  } catch (err) {
    console.error('[ContactAPI] Error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}
