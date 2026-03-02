import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'amg-footer',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  readonly socialLinks = [
    { href: 'https://www.instagram.com/amgdecorationdinterieur/', label: 'Instagram', icon: 'instagram' },
    { href: 'https://www.facebook.com/amgdecoration/', label: 'Facebook', icon: 'facebook' },
    { href: 'https://www.linkedin.com/in/amandine-gaury-97a263193/', label: 'LinkedIn', icon: 'linkedin' },
    { href: 'https://www.pinterest.fr/amgaury/', label: 'Pinterest', icon: 'pinterest' },
    { href: 'https://www.behance.net/amandinegaury', label: 'Behance', icon: 'behance' },
  ];
}
