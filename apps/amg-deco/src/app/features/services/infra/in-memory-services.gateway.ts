import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Service } from '@amg/data-access';
import { ServicesGateway } from '../domain/services.gateway';

const SERVICES_FALLBACK: Service[] = [
  {
    id: '1',
    title: 'Book Esquisses & Conseils Déco',
    subtitle: 'Pour visualiser votre projet',
    description: 'Un accompagnement personnalisé avec esquisses dessinées à la main et conseils de décoration adaptés à votre espace et vos envies.',
    includes: [
      { id: '1-i1', service_id: '1', text: 'Consultation à distance (visio ou téléphone)', order_index: 0 },
      { id: '1-i2', service_id: '1', text: 'Analyse de votre espace (plans, photos)', order_index: 1 },
      { id: '1-i3', service_id: '1', text: 'Esquisses et propositions de mobilier', order_index: 2 },
      { id: '1-i4', service_id: '1', text: 'Conseils matériaux, couleurs et textiles', order_index: 3 },
      { id: '1-i5', service_id: '1', text: 'Moodboard thématique', order_index: 4 },
      { id: '1-i6', service_id: '1', text: 'Récapitulatif PDF complet', order_index: 5 },
    ],
    prices: [
      { id: '1-p1', service_id: '1', label: 'Forfait unique', price: 480, unit: 'pièce', order_index: 0 },
    ],
    image: '/assets/images/services/moodboard-chambre.webp',
    order_index: 0,
  },
  {
    id: '2',
    title: 'Book Déco 3D',
    subtitle: 'Visualisez avant de décider',
    description: "Le service phare d'AMG. Un rendu 3D photoréaliste de votre pièce pour tout visualiser avant d'acheter. Économisez temps et argent.",
    includes: [
      { id: '2-i1', service_id: '2', text: 'Modélisation 3D complète de la pièce', order_index: 0 },
      { id: '2-i2', service_id: '2', text: 'Plusieurs vues (perspectives, vues de face)', order_index: 1 },
      { id: '2-i3', service_id: '2', text: 'Sélection mobilier et matériaux', order_index: 2 },
      { id: '2-i4', service_id: '2', text: 'Palette de couleurs personnalisée', order_index: 3 },
      { id: '2-i5', service_id: '2', text: 'Liste de courses détaillée avec liens', order_index: 4 },
      { id: '2-i6', service_id: '2', text: 'Fichier PDF haute résolution', order_index: 5 },
    ],
    prices: [
      { id: '2-p1', service_id: '2', label: 'Pièce moins de 15m²', price: 520, unit: 'pièce', order_index: 0 },
      { id: '2-p2', service_id: '2', label: 'Pièce entre 16 et 45m²', price: 720, unit: 'pièce', order_index: 1 },
      { id: '2-p3', service_id: '2', label: 'Pièce entre 46 et 90m²', price: 1120, unit: 'pièce', order_index: 2 },
    ],
    image: '/assets/images/services/planche-mobilier.webp',
    note: 'Le Book Déco 3D est le service le plus demandé. Il permet de visualiser votre intérieur avant tout achat.',
    order_index: 1,
  },
  {
    id: '3',
    title: 'Meuble Sur-Mesure 3D',
    subtitle: 'Un meuble unique pour votre espace',
    description: "Création d'un meuble 100% sur-mesure en 3D. Du plan à la réalisation, chaque détail est pensé pour s'adapter parfaitement à votre espace.",
    includes: [
      { id: '3-i1', service_id: '3', text: 'Analyse des besoins et contraintes', order_index: 0 },
      { id: '3-i2', service_id: '3', text: 'Conception 3D du meuble sur-mesure', order_index: 1 },
      { id: '3-i3', service_id: '3', text: 'Choix des matériaux et finitions', order_index: 2 },
      { id: '3-i4', service_id: '3', text: 'Plans techniques pour artisan', order_index: 3 },
      { id: '3-i5', service_id: '3', text: 'Suivi de réalisation', order_index: 4 },
    ],
    prices: [
      { id: '3-p1', service_id: '3', label: 'Forfait meuble sur-mesure', price: 400, unit: 'meuble', order_index: 0 },
    ],
    image: '/assets/images/services/meuble-sur-mesure.webp',
    order_index: 2,
  },
  {
    id: '4',
    title: 'Offre Professionnels',
    subtitle: 'Investisseurs & agents immobiliers',
    description: "Solution dédiée aux professionnels de l'immobilier souhaitant valoriser leurs biens avec des rendus 3D attractifs pour la vente ou la location.",
    includes: [
      { id: '4-i1', service_id: '4', text: "Rendu 3D d'une pièce clé (salon ou chambre)", order_index: 0 },
      { id: '4-i2', service_id: '4', text: 'Photos et visuels haute résolution', order_index: 1 },
      { id: '4-i3', service_id: '4', text: 'Délai express sous 5 jours ouvrés', order_index: 2 },
      { id: '4-i4', service_id: '4', text: 'Formats adaptés pour annonces immobilières', order_index: 3 },
      { id: '4-i5', service_id: '4', text: 'Tarif dégressif à partir de 3 biens', order_index: 4 },
    ],
    prices: [
      { id: '4-p1', service_id: '4', label: 'Offre professionnels', price: 149, unit: 'bien', order_index: 0 },
    ],
    image: '/assets/images/services/pro-visuel.webp',
    note: 'Tarif dégressif à partir de 3 biens. Contactez-moi pour un devis personnalisé.',
    order_index: 3,
  },
];

@Injectable({ providedIn: 'root' })
export class InMemoryServicesGateway implements ServicesGateway {
  private readonly services$ = of(SERVICES_FALLBACK).pipe(shareReplay(1));

  getAll(): Observable<Service[]> {
    return this.services$;
  }
}
