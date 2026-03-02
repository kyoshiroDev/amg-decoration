import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'amg-section-title',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="section-title" [ngClass]="'section-title--' + align()">
      @if (eyebrow()) {
        <p class="section-title__eyebrow">{{ eyebrow() }}</p>
      }
      <h2 class="section-title__heading">{{ title() }}</h2>
      <span class="divider-gold" [ngClass]="{ 'mx-0': align() === 'left' }"></span>
      @if (subtitle()) {
        <p class="section-title__subtitle">{{ subtitle() }}</p>
      }
    </div>
  `,
  styles: [`
    .section-title { margin-bottom: 3rem; }
    .section-title--center { text-align: center; }
    .section-title--left { text-align: left; }
    .section-title--right { text-align: right; }

    .section-title__eyebrow {
      font-family: var(--font-body);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--color-gold);
      margin-bottom: 0.75rem;
    }

    .section-title__heading {
      font-family: var(--font-heading);
      font-size: clamp(1.75rem, 3vw, 2.75rem);
      font-weight: 700;
      color: var(--color-dark);
      line-height: 1.2;
      margin-bottom: 0;
    }

    .section-title__subtitle {
      font-family: var(--font-body);
      font-size: 1.05rem;
      line-height: 1.7;
      color: var(--color-gray);
      max-width: 680px;
      margin-top: 1rem;
    }

    .section-title--center .section-title__subtitle {
      margin-left: auto;
      margin-right: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  readonly eyebrow = input<string>('');
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly align = input<'left' | 'center' | 'right'>('center');
}
