import { Component, ChangeDetectionStrategy, signal, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'amg-footer',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  // Signal initialisé à null côté serveur — mis à jour après hydratation côté client.
  // Évite tout mismatch SSR (la valeur serveur et client sont identiques au moment de l'hydratation).
  readonly currentYear = signal<number | null>(null);

  readonly socialLinks = [
    { href: 'https://www.instagram.com/amgdecorationdinterieur/', label: 'Instagram', icon: 'instagram' },
    { href: 'https://www.facebook.com/amgdecoration/', label: 'Facebook', icon: 'facebook' },
    { href: 'https://www.linkedin.com/in/amandine-gaury-97a263193/', label: 'LinkedIn', icon: 'linkedin' },
    { href: 'https://www.pinterest.fr/amgaury/', label: 'Pinterest', icon: 'pinterest' },
    { href: 'https://www.behance.net/amandinegaury', label: 'Behance', icon: 'behance' },
  ];

  constructor() {
    afterNextRender(() => {
      this.currentYear.set(new Date().getFullYear());
    });
  }
}
