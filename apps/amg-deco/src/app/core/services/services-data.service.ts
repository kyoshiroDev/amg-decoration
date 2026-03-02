import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Service } from '../../models/service.model';

const SERVICES_DATA: Service[] = [
  {
    id: '1',
    title: 'Book Esquisses & Conseils Déco',
    subtitle: 'Pour visualiser votre projet',
    description: 'Un accompagnement personnalisé avec esquisses dessinées à la main et conseils de décoration adaptés à votre espace et vos envies.',
    includes: [
      'Consultation à distance (visio ou téléphone)',
      'Analyse de votre espace (plans, photos)',
      'Esquisses et propositions de mobilier',
      'Conseils matériaux, couleurs et textiles',
      'Moodboard thématique',
      'Récapitulatif PDF complet',
    ],
    offers: [
      { id: '1-1', label: 'Forfait unique', price: 480, unit: 'pièce' },
    ],
    image: '/assets/images/services/moodboard-chambre.webp',
  },
  {
    id: '2',
    title: 'Book Déco 3D',
    subtitle: 'Visualisez avant de décider',
    description: 'Le service phare d\'AMG. Un rendu 3D photoréaliste de votre pièce pour tout visualiser avant d\'acheter. Économisez temps et argent.',
    includes: [
      'Modélisation 3D complète de la pièce',
      'Plusieurs vues (perspectives, vues de face)',
      'Sélection mobilier et matériaux',
      'Palette de couleurs personnalisée',
      'Liste de courses détaillée avec liens',
      'Fichier PDF haute résolution',
    ],
    offers: [
      { id: '2-1', label: 'Pièce moins de 15m²', price: 520, unit: 'pièce' },
      { id: '2-2', label: 'Pièce entre 16 et 45m²', price: 720, unit: 'pièce' },
      { id: '2-3', label: 'Pièce entre 46 et 90m²', price: 1120, unit: 'pièce' },
    ],
    image: '/assets/images/services/planche-mobilier.webp',
    note: 'Le Book Déco 3D est le service le plus demandé. Il permet de visualiser votre intérieur avant tout achat.',
  },
  {
    id: '3',
    title: 'Meuble Sur-Mesure 3D',
    subtitle: 'Un meuble unique pour votre espace',
    description: 'Création d\'un meuble 100% sur-mesure en 3D. Du plan à la réalisation, chaque détail est pensé pour s\'adapter parfaitement à votre espace.',
    includes: [
      'Analyse des besoins et contraintes',
      'Conception 3D du meuble sur-mesure',
      'Choix des matériaux et finitions',
      'Plans techniques pour artisan',
      'Suivi de réalisation',
    ],
    offers: [
      { id: '3-1', label: 'Forfait meuble sur-mesure', price: 400, unit: 'meuble' },
    ],
    image: '/assets/images/services/meuble-sur-mesure.webp',
  },
  {
    id: '4',
    title: 'Offre Professionnels',
    subtitle: 'Investisseurs & agents immobiliers',
    description: 'Solution dédiée aux professionnels de l\'immobilier souhaitant valoriser leurs biens avec des rendus 3D attractifs pour la vente ou la location.',
    includes: [
      'Rendu 3D d\'une pièce clé (salon ou chambre)',
      'Photos et visuels haute résolution',
      'Délai express sous 5 jours ouvrés',
      'Formats adaptés pour annonces immobilières',
      'Tarif dégressif à partir de 3 biens',
    ],
    offers: [
      { id: '4-1', label: 'Offre professionnels', price: 149, unit: 'bien' },
    ],
    image: '/assets/images/services/pro-visuel.webp',
    note: 'Tarif dégressif à partir de 3 biens. Contactez-moi pour un devis personnalisé.',
  },
];

/**
 * @service ServicesDataService
 * @description Accès aux données des prestations AMG.
 */
@Injectable({ providedIn: 'root' })
export class ServicesDataService {
  private readonly services$ = of(SERVICES_DATA).pipe(shareReplay(1));

  getAll$(): Observable<Service[]> {
    return this.services$;
  }
}
