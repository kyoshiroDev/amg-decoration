import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'amg-cgs',
  standalone: true,
  imports: [],
  templateUrl: './cgs.component.html',
  styleUrl: './cgs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CgsComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage({
      title: "Conditions Générales de Services — AMG Décoration d'Intérieur",
      description:
        "Conditions Générales de Services d'AMG Décoration d'Intérieur — Amandine Gaury, décoratrice d'intérieur 3D.",
      url: 'https://amgdecorationdinterieur.com/conditions-generales-de-services',
    });
  }
}
