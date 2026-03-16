import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { signal, computed } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { HomeFacade } from './application/home.facade';
import { HeroSliderComponent, SlideItem } from '../../shared/components/hero-slider/hero-slider.component';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { InstagramFeedComponent } from '../../shared/components/instagram-feed/instagram-feed.component';
import { AvisClient } from '@amg/data-access';

@Component({
  selector: 'amg-home',
  imports: [HeroSliderComponent, SectionTitleComponent, InstagramFeedComponent, RouterLink, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly facade = inject(HomeFacade);

  readonly avisClients = toSignal(this.facade.getAvisClients$(), {
    initialValue: [] as AvisClient[],
  });

  readonly projects = toSignal(this.facade.getProjects$(), {
    initialValue: [],
  });

  readonly activeAvisClient = signal(0);

  readonly currentAvisClient = computed(
    () => this.avisClients()[this.activeAvisClient()]
  );

  readonly heroSlides: SlideItem[] = [
    { id: '1', src: '/assets/images/hero/hero-1.webp', alt: "Salon moderne aménagé en 3D par AMG Décoration d'Intérieur" },
    { id: '2', src: '/assets/images/hero/hero-2.webp', alt: 'Terrasse contemporaine aménagée en 3D' },
    { id: '3', src: '/assets/images/hero/hero-3.webp', alt: 'Terrasse moderne avec pergola bioclimatique' },
    { id: '4', src: '/assets/images/hero/hero-4.webp', alt: 'Chambre parentale cosy avec tête de lit sur-mesure' },
    { id: '5', src: '/assets/images/hero/hero-5.webp', alt: 'Salon haussmannien rénové en 3D' },
    { id: '6', src: '/assets/images/hero/hero-6.webp', alt: 'Bureau créatif et lumineux' },
  ];

  readonly advantages = [
    {
      icon: '💰',
      title: 'Économies garanties',
      description: "Évitez les erreurs coûteuses en visualisant chaque détail avant d'acheter quoi que ce soit.",
    },
    {
      icon: '🎨',
      title: 'Visualisation réaliste',
      description: 'Des rendus 3D photoréalistes qui vous permettent de vous projeter dans votre futur intérieur.',
    },
    {
      icon: '✨',
      title: 'Sur-mesure',
      description: 'Chaque projet est unique et pensé pour refléter votre personnalité et vos besoins.',
    },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: "AMG Décoration d'Intérieur — Designer 3D en région parisienne",
      description:
        "Décoratrice d'intérieur 3D certifiée MJM Design Graphic. Visualisez votre futur intérieur avec un rendu 3D photoréaliste. Région parisienne et toute la France.",
      url: 'https://amgdecorationdinterieur.com',
      image: '/assets/images/hero/hero-1.webp',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: "AMG Décoration d'Intérieur",
        description:
          "Décoratrice d'intérieur 3D certifiée MJM Design Graphic, Paris. Région parisienne et toute la France.",
        url: 'https://amgdecorationdinterieur.com',
        telephone: '+33782358132',
        email: 'am.gaury@gmail.com',
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'Île-de-France',
          addressCountry: 'FR',
        },
        sameAs: [
          'https://www.facebook.com/amgdecoration/',
          'https://www.instagram.com/amgdecorationdinterieur/',
          'https://www.linkedin.com/in/amandine-gaury-97a263193/',
        ],
      },
    });
  }

  starsArray(n: number): number[] {
    return Array(n).fill(0);
  }

  goToAvisClient(index: number): void {
    this.activeAvisClient.set(index);
  }

  nextAvisClient(): void {
    this.activeAvisClient.update(i => (i + 1) % this.avisClients().length);
  }

  previousAvisClient(): void {
    this.activeAvisClient.update(
      i => (i - 1 + this.avisClients().length) % this.avisClients().length
    );
  }
}
