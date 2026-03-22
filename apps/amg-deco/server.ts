import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { sendContactEmail } from '../../api/_contact-handler';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const allowedHostsEnv = process.env['NG_ALLOWED_HOSTS'];
  const commonEngine = new CommonEngine({
    allowedHosts: allowedHostsEnv ? allowedHostsEnv.split(',').map(h => h.trim()) : ['localhost'],
  });

  server.use(compression());
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // ─── API contact ──────────────────────────────────────────────────────────
  server.post('/api/contact', express.json(), async (req, res) => {
    try {
      const { status, json } = await sendContactEmail(req.body ?? {});
      res.status(status).json(json);
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
    }),
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
