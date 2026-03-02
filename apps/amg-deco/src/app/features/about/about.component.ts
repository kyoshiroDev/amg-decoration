import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';

@Component({
  selector: 'amg-about',
  standalone: true,
  imports: [SectionTitleComponent, NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly certifications = [
    'Certifiée MJM Design Graphic — École d\'Art et de Design, Paris',
    'Formation 3D Architecture & Design d\'Intérieur',
    'Maîtrise des logiciels : SketchUp, 3ds Max, Blender, Photoshop',
    'Expérience en région parisienne et projets France entière',
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: "À Propos — AMG Décoration d'Intérieur",
      description:
        "Découvrez Amandine Gaury, décoratrice d'intérieur 3D certifiée MJM Design Graphic. Son parcours, sa vision et ses valeurs.",
      url: 'https://amgdecorationdinterieur.com/a-propos',
    });
  }
}
