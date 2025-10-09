import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-product-details-page',
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Detalhes do Produto</h1>
      <p class="placeholder">(em construção)</p>
    </section>
  `,
  styles: [
    `
      .page {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 600;
      }

      .placeholder {
        margin: 0;
        color: rgba(15, 23, 42, 0.6);
        font-style: italic;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsPage {}
