import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'amg-section-title',
  standalone: true,
  imports: [],
  template: `
    <div [class]="containerClass()">
      @if (eyebrow()) {
        <p class="section-title__eyebrow">{{ eyebrow() }}</p>
      }
      <h2 class="section-title__heading">{{ title() }}</h2>
      <span [class]="dividerClass()"></span>
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
      color: var(--color-gold-accessible);
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

    /* Variante fond sombre */
    .section-title--on-dark .section-title__eyebrow {
      color: var(--color-gold);
    }

    .section-title--on-dark .section-title__heading {
      color: var(--color-white);
    }

    .section-title--on-dark .section-title__subtitle {
      color: rgba(255, 255, 255, 0.85);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  readonly eyebrow = input<string>('');
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly align = input<'left' | 'center' | 'right'>('center');
  readonly variant = input<'light' | 'dark'>('light');

  readonly containerClass = computed(() => {
    const classes = ['section-title', `section-title--${this.align()}`];
    if (this.variant() === 'dark') classes.push('section-title--on-dark');
    return classes.join(' ');
  });

  readonly dividerClass = computed(() =>
    this.align() === 'left' ? 'divider-gold mx-0' : 'divider-gold'
  );
}
