export interface ContactBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  gdprAccepted?: unknown;
}

export interface ContactResult {
  status: number;
  json: Record<string, unknown>;
}

export async function sendContactEmail(body: ContactBody): Promise<ContactResult> {
  const { name, email, phone, message, gdprAccepted } = body;

  if (!name || !email || !message || !gdprAccepted) {
    return { status: 400, json: { error: 'Données manquantes.' } };
  }

  const apiKey = process.env['CONTACT_EMAIL_API_KEY'];
  const recipient = process.env['CONTACT_FORM_RECIPIENT'] ?? 'am.gaury@gmail.com';

  if (!apiKey) {
    console.log('[ContactAPI] Message reçu (pas de clé API) :', { name, email, message });
    return { status: 200, json: { success: true } };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
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
    return { status: 500, json: { error: "Erreur lors de l'envoi." } };
  }

  return { status: 200, json: { success: true } };
}
