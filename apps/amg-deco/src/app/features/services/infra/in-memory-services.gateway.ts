import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Service } from '@amg/data-access';
import { ServicesGateway } from '../domain/services.gateway';

const SERVICES_FALLBACK: Service[] = [
  {
    id: '1',
    title: 'Book Esquisses & Conseils Déco',
    subtitle: undefined,
    description:
      "Une première approche créative de votre projet d'intérieur. Je vous remets des esquisses dessinées à la main et des conseils personnalisés pour orienter vos choix de décoration.",
    includes: [
      { id: '1-1', service_id: '1', text: 'Analyse de votre espace et de vos besoins', order_index: 0 },
      { id: '1-2', service_id: '1', text: 'Esquisses dessinées de votre pièce', order_index: 1 },
      { id: '1-3', service_id: '1', text: 'Conseils personnalisés sur les couleurs et matériaux', order_index: 2 },
      { id: '1-4', service_id: '1', text: 'Liste de recommandations mobilier', order_index: 3 },
    ],
    prices: [{ id: '1-p1', service_id: '1', label: 'Forfait unique', price: 480, unit: undefined, order_index: 0 }],
    image: '/assets/images/services/moodboard-chambre.webp',
    note: undefined,
    order_index: 0,
  },
  {
    id: '2',
    title: 'Book Déco 3D',
    subtitle: 'Notre prestation phare',
    description:
      "La prestation complète pour visualiser votre futur intérieur avec des rendus 3D photoréalistes avant d'acheter quoi que ce soit. Un book PDF haute résolution vous est remis à la livraison.",
    includes: [
      { id: '2-1', service_id: '2', text: 'Modélisation 3D complète de votre pièce', order_index: 0 },
      { id: '2-2', service_id: '2', text: 'Rendus photoréalistes (vues multiples)', order_index: 1 },
      { id: '2-3', service_id: '2', text: 'Sélection mobilier, couleurs et matériaux', order_index: 2 },
      { id: '2-4', service_id: '2', text: 'Book PDF haute résolution', order_index: 3 },
      { id: '2-5', service_id: '2', text: "Liste de courses avec liens d'achat", order_index: 4 },
      { id: '2-6', service_id: '2', text: 'Une session de retouches incluse', order_index: 5 },
    ],
    prices: [
      { id: '2-p1', service_id: '2', label: 'Pièce < 15 m²', price: 520, unit: undefined, order_index: 0 },
      { id: '2-p2', service_id: '2', label: 'Pièce 16 – 45 m²', price: 720, unit: undefined, order_index: 1 },
      { id: '2-p3', service_id: '2', label: 'Pièce 46 – 90 m²', price: 1120, unit: undefined, order_index: 2 },
    ],
    image: '/assets/images/services/planche-mobilier.webp',
    note: 'Tarif dégressif pour plusieurs pièces — contactez-moi pour un devis personnalisé.',
    order_index: 1,
  },
  {
    id: '3',
    title: 'Meuble Sur-Mesure',
    subtitle: undefined,
    description:
      "Conception en 3D d'un meuble entièrement sur-mesure, adapté à votre espace et à votre style. Plans techniques fournis pour la réalisation par votre artisan.",
    includes: [
      { id: '3-1', service_id: '3', text: 'Conception 3D du meuble sur-mesure', order_index: 0 },
      { id: '3-2', service_id: '3', text: 'Plans techniques cotés', order_index: 1 },
      { id: '3-3', service_id: '3', text: 'Vues 3D photoréalistes du rendu final', order_index: 2 },
      { id: '3-4', service_id: '3', text: 'Conseils sur les matériaux et finitions', order_index: 3 },
    ],
    prices: [{ id: '3-p1', service_id: '3', label: 'Forfait par meuble', price: 400, unit: undefined, order_index: 0 }],
    image: '/assets/images/services/meuble-sur-mesure.webp',
    note: undefined,
    order_index: 2,
  },
  {
    id: '4',
    title: 'Offre Professionnels',
    subtitle: 'Investisseurs & agents immobiliers',
    description:
      "Une offre dédiée aux professionnels de l'immobilier pour valoriser vos biens avec des projections 3D attrayantes et convaincantes.",
    includes: [
      { id: '4-1', service_id: '4', text: 'Rendu 3D du bien meublé et décoré', order_index: 0 },
      { id: '4-2', service_id: '4', text: 'Mise en valeur pour annonces et supports de vente', order_index: 1 },
      { id: '4-3', service_id: '4', text: 'Livraison rapide sous 5 jours ouvrés', order_index: 2 },
      { id: '4-4', service_id: '4', text: 'Tarif dégressif à partir de 3 biens', order_index: 3 },
    ],
    prices: [{ id: '4-p1', service_id: '4', label: 'Par bien', price: 149, unit: undefined, order_index: 0 }],
    image: '/assets/images/services/pro-visuel.webp',
    note: undefined,
    order_index: 3,
  },
];

@Injectable({ providedIn: 'root' })
export class InMemoryServicesGateway implements ServicesGateway {
  private readonly _services$ = of(SERVICES_FALLBACK).pipe(shareReplay(1));

  getAll(): Observable<Service[]> {
    return this._services$;
  }
}
