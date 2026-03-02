import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SectionTitleComponent } from '../section-title/section-title.component';

export interface InstagramPost {
  id: string;
  image: string;
  alt: string;
  caption: string;
  link: string;
}

/**
 * @component InstagramFeedComponent
 * @description Affiche un aperçu des derniers posts Instagram d'AMG Décoration.
 * Les données sont statiques (pas d'API Instagram) — mettre à jour manuellement.
 *
 * @accessibility
 * - Liens avec aria-label explicites
 * - Images avec alt descriptifs
 * - Rôle region avec label
 */
@Component({
  selector: 'amg-instagram-feed',
  standalone: true,
  imports: [SectionTitleComponent, NgOptimizedImage],
  templateUrl: './instagram-feed.component.html',
  styleUrl: './instagram-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstagramFeedComponent {
  readonly profileUrl = 'https://www.instagram.com/amgdecorationdinterieur/';

  readonly posts: InstagramPost[] = [
    {
      id: '1',
      image: '/assets/images/hero/hero-1.webp',
      alt: 'Salon moderne aménagé en 3D — projet AMG Décoration',
      caption: 'Nouveau projet salon ✨ Rendu 3D photoréaliste pour ce beau projet en région parisienne.',
      link: 'https://www.instagram.com/amgdecorationdinterieur/',
    },
    {
      id: '2',
      image: '/assets/images/hero/hero-4.webp',
      alt: 'Chambre parentale cosy avec tête de lit sur-mesure — rendu 3D',
      caption: 'Chambre parentale cosy 🛏️ Ambiance chaleureuse et épurée.',
      link: 'https://www.instagram.com/amgdecorationdinterieur/',
    },
    {
      id: '3',
      image: '/assets/images/hero/hero-2.webp',
      alt: 'Terrasse contemporaine aménagée en 3D par AMG Décoration',
      caption: 'Terrasse de rêve ☀️ Aménagement extérieur avec pergola bioclimatique.',
      link: 'https://www.instagram.com/amgdecorationdinterieur/',
    },
    {
      id: '4',
      image: '/assets/images/hero/hero-5.webp',
      alt: 'Salon haussmannien rénové en 3D — décoration intérieure',
      caption: 'Appartement haussmannien 🏛️ Marier le classique et le contemporain.',
      link: 'https://www.instagram.com/amgdecorationdinterieur/',
    },
  ];
}
