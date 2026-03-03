import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // ─── API contact ──────────────────────────────────────────────────────────
  server.post('/api/contact', express.json(), async (req, res) => {
    const { name, email, phone, message, gdprAccepted } = req.body ?? {};

    if (!name || !email || !message || !gdprAccepted) {
      res.status(400).json({ error: 'Données manquantes.' });
      return;
    }

    const apiKey = process.env['CONTACT_EMAIL_API_KEY'];
    const recipient = process.env['CONTACT_FORM_RECIPIENT'] ?? 'am.gaury@gmail.com';

    if (!apiKey) {
      // En dev local sans clé API — log uniquement
      console.log('[ContactAPI] Message reçu (pas de clé API configurée) :', { name, email, message });
      res.status(200).json({ success: true });
      return;
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
          html: `<h2>Nouveau message de contact</h2><p><strong>Nom :</strong> ${name}</p><p><strong>Email :</strong> ${email}</p>${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ''}<p><strong>Message :</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('[ContactAPI] Resend error:', err);
        res.status(500).json({ error: "Erreur lors de l'envoi." });
        return;
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error('[ContactAPI] Error:', err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });

  // Serve static files from /browser
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    })
  );

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then(html => res.send(html))
      .catch(err => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Ne pas appeler listen() sur Vercel (environnement serverless)
if (!process.env['VERCEL']) {
  run();
}

// Export pour Vercel — l'app Express est le handler serverless
export default app();
