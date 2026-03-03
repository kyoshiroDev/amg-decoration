import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message, gdprAccepted } = req.body ?? {};

  if (!name || !email || !message || !gdprAccepted) {
    return res.status(400).json({ error: 'Données manquantes.' });
  }

  const apiKey = process.env['CONTACT_EMAIL_API_KEY'];
  const recipient = process.env['CONTACT_FORM_RECIPIENT'] ?? 'am.gaury@gmail.com';

  if (!apiKey) {
    console.log('[ContactAPI] Message reçu (pas de clé API configurée) :', { name, email, message });
    return res.status(200).json({ success: true });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'AMG Décoration <contact@amgdecorationdinterieur.com>',
        to: [recipient],
        reply_to: email,
        subject: `Nouveau message de ${name} — AMG Décoration`,
        html: `<h2>Nouveau message de contact</h2>
               <p><strong>Nom :</strong> ${name}</p>
               <p><strong>Email :</strong> ${email}</p>
               ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ''}
               <p><strong>Message :</strong></p>
               <p>${String(message).replace(/\n/g, '<br>')}</p>`,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[ContactAPI] Resend error:', err);
      return res.status(500).json({ error: "Erreur lors de l'envoi." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[ContactAPI] Error:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
}