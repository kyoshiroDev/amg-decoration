import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoConfig } from '@amg/data-access';

/**
 * @service SeoService
 * @description Gestion centralisée des balises meta, Open Graph et JSON-LD.
 * Compatible SSR — doit être appelé dans chaque composant de page.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly _meta = inject(Meta);
  private readonly _titleService = inject(Title);
  private readonly _doc = inject(DOCUMENT);

  /**
   * Met à jour toutes les métadonnées SEO d'une page.
   */
  setPage(config: SeoConfig): void {
    this._titleService.setTitle(config.title);
    this._meta.updateTag({ name: 'description', content: config.description });
    this.setCanonical(config.url);

    // Open Graph
    this._meta.updateTag({ property: 'og:title', content: config.title });
    this._meta.updateTag({ property: 'og:description', content: config.description });
    this._meta.updateTag({ property: 'og:url', content: config.url });
    this._meta.updateTag({ property: 'og:image', content: config.image ?? '' });
    this._meta.updateTag({ property: 'og:type', content: 'website' });
    this._meta.updateTag({ property: 'og:locale', content: 'fr_FR' });

    // Twitter Card
    this._meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this._meta.updateTag({ name: 'twitter:title', content: config.title });
    this._meta.updateTag({ name: 'twitter:description', content: config.description });

    this._cleanJsonLd();
    if (config.jsonLd) {
      this.setJsonLd(config.jsonLd);
    }
  }

  /**
   * Injecte un JSON-LD Schema.org dans le <head>.
   */
  setJsonLd(schema: object): void {
    const script = this._doc.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    this._doc.head.appendChild(script);
  }

  private _cleanJsonLd(): void {
    this._doc.querySelector('script[type="application/ld+json"]')?.remove();
  }

  private setCanonical(url: string): void {
    let link = this._doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this._doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this._doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
