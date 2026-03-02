import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'amg-legal',
  standalone: true,
  imports: [],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage({
      title: "Mentions légales — AMG Décoration d'Intérieur",
      description: "Mentions légales d'AMG Décoration d'Intérieur — Amandine Gaury.",
      url: 'https://amgdecorationdinterieur.com/mentions-legales',
    });
  }
}
