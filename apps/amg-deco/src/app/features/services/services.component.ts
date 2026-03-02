import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SeoService } from '../../core/services/seo.service';
import { ServicesDataService } from '../../core/services/services-data.service';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { Service } from '../../models/service.model';

@Component({
  selector: 'amg-services',
  standalone: true,
  imports: [SectionTitleComponent, NgOptimizedImage, RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly servicesDataService = inject(ServicesDataService);

  readonly services = toSignal(this.servicesDataService.getAll$(), {
    initialValue: [] as Service[],
  });

  readonly processSteps = [
    { number: '01', title: 'Premier contact', description: 'Un échange par téléphone ou visio pour comprendre votre projet, vos goûts et vos contraintes.' },
    { number: '02', title: 'Devis personnalisé', description: "Envoi d'un devis détaillé et d'un contrat de prestation sous 48h." },
    { number: '03', title: 'Collecte des informations', description: 'Vous me transmettez les plans de votre pièce, des photos et vos inspirations.' },
    { number: '04', title: 'Création 3D', description: "Je modélise votre espace en 3D et sélectionne mobilier, matériaux et couleurs selon vos envies." },
    { number: '05', title: 'Présentation & ajustements', description: "Présentation du projet en visio avec possibilité d'ajustements inclus." },
    { number: '06', title: 'Livraison du book', description: 'Vous recevez votre book PDF haute résolution avec la liste de courses et les liens d\'achat.' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: "Prestations — AMG Décoration d'Intérieur",
      description:
        "Découvrez les prestations de décoration d'intérieur 3D d'Amandine Gaury : Book Esquisses, Book Déco 3D, Meuble Sur-Mesure et offre Professionnels.",
      url: 'https://amgdecorationdinterieur.com/prestations',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Book Déco 3D',
        provider: { '@type': 'LocalBusiness', name: "AMG Décoration d'Intérieur" },
        offers: [
          { '@type': 'Offer', name: 'Pièce moins de 15m²', price: '520', priceCurrency: 'EUR' },
          { '@type': 'Offer', name: 'Pièce entre 16 et 45m²', price: '720', priceCurrency: 'EUR' },
          { '@type': 'Offer', name: 'Pièce entre 46 et 90m²', price: '1120', priceCurrency: 'EUR' },
        ],
      },
    });
  }
}
