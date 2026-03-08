/**
 * Script de seed Supabase — AMG Décoration d'Intérieur
 *
 * Usage :
 *   npx tsx scripts/seed-supabase.ts
 *
 * Variables d'environnement requises :
 *   SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...  (service_role key, pas anon key)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env['SUPABASE_URL'];
const SUPABASE_SERVICE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('⚠️  SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── Données initiales ────────────────────────────────────────────────────────

const PROJECTS = [
  {
    identifiant_url: 'salon-moderne-ile-de-france',
    title: 'Salon Moderne — Île-de-France',
    description: 'Réaménagement complet d\'un salon avec rendu 3D photoréaliste. Canapé modulable, teintes neutres et touches dorées.',
    images: ['/assets/images/hero/hero-1.webp'],
    category: 'salon',
    room_type: 'Salon',
  },
  {
    identifiant_url: 'terrasse-contemporaine',
    title: 'Terrasse Contemporaine',
    description: 'Aménagement d\'une terrasse avec mobilier outdoor haut de gamme et végétalisation. Rendu 3D réaliste.',
    images: ['/assets/images/hero/hero-2.webp'],
    category: 'terrasse',
    room_type: 'Terrasse',
  },
  {
    identifiant_url: 'terrasse-moderne',
    title: 'Terrasse Moderne',
    description: 'Seconde terrasse avec pergola bioclimatique et coin lounge. Projet sur mesure.',
    images: ['/assets/images/hero/hero-3.webp'],
    category: 'terrasse',
    room_type: 'Terrasse',
  },
  {
    identifiant_url: 'chambre-parentale',
    title: 'Chambre Parentale Cosy',
    description: 'Suite parentale avec tête de lit sur-mesure, palette de couleurs chaudes et lumière douce.',
    images: ['/assets/images/hero/hero-4.webp'],
    category: 'chambre',
    room_type: 'Chambre',
  },
  {
    identifiant_url: 'salon-haussmannien',
    title: 'Salon Haussmannien Rénové',
    description: 'Réhabilitation d\'un appartement haussmannien avec respect des moulures et modernisation de l\'espace.',
    images: ['/assets/images/hero/hero-5.webp'],
    category: 'salon',
    room_type: 'Salon',
  },
  {
    identifiant_url: 'bureau-creatif',
    title: 'Bureau Créatif',
    description: 'Espace de travail optimisé pour la créativité avec rangements malins et ambiance inspirante.',
    images: ['/assets/images/hero/hero-6.webp'],
    category: 'bureau',
    room_type: 'Bureau',
  },
];

const SERVICES = [
  {
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
    order_index: 0,
  },
  {
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
    note: 'Le Book Déco 3D est le service le plus demandé.',
    order_index: 1,
  },
  {
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
    order_index: 2,
  },
  {
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
    order_index: 3,
  },
];

const TESTIMONIALS = [
  {
    name: 'Patrick V.',
    text: 'Amandine a complètement transformé notre salon. Le rendu 3D était tellement précis que nous avons pu visualiser le résultat final avant même de commencer les travaux. Un travail exceptionnel !',
    rating: 5,
  },
  {
    name: 'Sébastien T.',
    text: 'Professionnelle, créative et à l\'écoute. Amandine a su comprendre nos envies et les traduire en un projet cohérent et esthétique. Je recommande vivement !',
    rating: 5,
  },
  {
    name: 'Catherine T.',
    text: 'Grâce au book 3D, j\'ai pu tout visualiser avant d\'acheter quoi que ce soit. Ça m\'a évité de nombreuses erreurs et économisé beaucoup d\'argent. Merci Amandine !',
    rating: 5,
  },
];

const INSTAGRAM_POSTS = [
  {
    image_url: 'https://www.instagram.com/amgdecorationdinterieur/',
    caption: 'Découvrez nos dernières réalisations 3D ✨',
    link: 'https://www.instagram.com/amgdecorationdinterieur/',
    order_index: 0,
  },
  {
    image_url: 'https://www.instagram.com/amgdecorationdinterieur/',
    caption: 'Nouvelle terrasse contemporaine 🌿',
    link: 'https://www.instagram.com/amgdecorationdinterieur/',
    order_index: 1,
  },
  {
    image_url: 'https://www.instagram.com/amgdecorationdinterieur/',
    caption: 'Suite parentale sur-mesure 🛋️',
    link: 'https://www.instagram.com/amgdecorationdinterieur/',
    order_index: 2,
  },
  {
    image_url: 'https://www.instagram.com/amgdecorationdinterieur/',
    caption: 'Bureau créatif et lumineux 💡',
    link: 'https://www.instagram.com/amgdecorationdinterieur/',
    order_index: 3,
  },
];

// ─── Seed ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Début du seed Supabase...\n');

  // Projects
  console.log('📁 Insertion des projets...');
  const { error: projErr } = await supabase.from('projects').insert(PROJECTS);
  if (projErr) console.error('  ❌ Projets:', projErr.message);
  else console.log(`  ✅ ${PROJECTS.length} projets insérés`);

  // Services
  console.log('📋 Insertion des prestations...');
  const { error: svcErr } = await supabase.from('services').insert(SERVICES);
  if (svcErr) console.error('  ❌ Prestations:', svcErr.message);
  else console.log(`  ✅ ${SERVICES.length} prestations insérées`);

  // Testimonials
  console.log('💬 Insertion des témoignages...');
  const { error: testErr } = await supabase.from('testimonials').insert(TESTIMONIALS);
  if (testErr) console.error('  ❌ Témoignages:', testErr.message);
  else console.log(`  ✅ ${TESTIMONIALS.length} témoignages insérés`);

  // Instagram
  console.log('📸 Insertion des posts Instagram...');
  const { error: igErr } = await supabase.from('instagram_posts').insert(INSTAGRAM_POSTS);
  if (igErr) console.error('  ❌ Instagram:', igErr.message);
  else console.log(`  ✅ ${INSTAGRAM_POSTS.length} posts insérés`);

  console.log('\n✨ Seed terminé !');
}

seed().catch(console.error);
