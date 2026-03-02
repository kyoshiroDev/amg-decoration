import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnDestroy,
  afterNextRender,
  input,
} from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlatformService } from '../../../core/services/platform.service';

export interface SlideItem {
  id: string;
  src: string;
  alt: string;
}

/**
 * @component HeroSliderComponent
 * @description Slider hero avec rotation automatique, compatible SSR.
 * Côté serveur, affiche uniquement la première image.
 * Côté client, initialise le slider automatique.
 *
 * @accessibility
 * - aria-live="polite" pour les annonces
 * - Boutons précédent/suivant avec aria-label
 * - Pause au focus/hover
 * - Respect de prefers-reduced-motion
 */
@Component({
  selector: 'amg-hero-slider',
  standalone: true,
  imports: [NgClass, NgOptimizedImage, RouterLink],
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSliderComponent implements OnDestroy {
  private readonly platform = inject(PlatformService);

  readonly slides = input<SlideItem[]>([]);
  readonly autoPlayInterval = input<number>(5000);

  readonly activeSlide = signal(0);
  readonly isSliderPaused = signal(false);
  readonly isInitialized = signal(false);

  readonly totalSlides = computed(() => this.slides().length);
  readonly currentSlide = computed(() => this.slides()[this.activeSlide()]);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    afterNextRender(() => {
      this.isInitialized.set(true);
      this.startAutoPlay();
    });
  }

  private startAutoPlay(): void {
    this.intervalId = setInterval(() => {
      if (!this.isSliderPaused()) {
        this.nextSlide();
      }
    }, this.autoPlayInterval());
  }

  goToSlide(index: number): void {
    this.activeSlide.set(index);
  }

  nextSlide(): void {
    this.activeSlide.update(i => (i + 1) % this.totalSlides());
  }

  previousSlide(): void {
    this.activeSlide.update(i => (i - 1 + this.totalSlides()) % this.totalSlides());
  }

  pauseSlider(): void {
    this.isSliderPaused.set(true);
  }

  resumeSlider(): void {
    this.isSliderPaused.set(false);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
