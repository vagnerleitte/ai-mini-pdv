import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiTable } from '@taiga-ui/addon-table/components/table';

@Component({
  standalone: true,
  selector: 'app-products-list-page',
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <h1>Produtos</h1>
          <p class="subtitle">Gerencie o catálogo e mantenha o estoque em dia.</p>
        </div>
        <button tuiButton appearance="primary" size="m" (click)="goToSale()">
          Registrar Venda
        </button>
      </header>

      <div class="actions">
        <label class="search-label">
          <span class="visually-hidden">Buscar produtos</span>
          <input
            type="search"
            class="search-input"
            [(ngModel)]="searchTerm"
            placeholder="Buscar por nome ou SKU"
          />
        </label>
      </div>

      <div class="table-wrapper">
        <table tuiTable class="product-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr class="empty-state">
              <td colspan="5">
                Nenhum produto cadastrado ainda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .page-header h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 600;
      }

      .subtitle {
        margin: 0.25rem 0 0;
        color: rgba(15, 23, 42, 0.6);
      }

      .actions {
        display: flex;
        gap: 1rem;
      }

      .search-input {
        min-width: 320px;
        max-width: 420px;
        width: 100%;
        border: 1px solid rgba(15, 23, 42, 0.15);
        border-radius: 999px;
        padding: 0.65rem 1.25rem;
        font-size: 0.95rem;
        background: #ffffff;
        color: inherit;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .search-input:focus {
        outline: none;
        border-color: rgba(37, 99, 235, 0.5);
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      .table-wrapper {
        background: #fff;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 12px;
        overflow: hidden;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      thead {
        background: rgba(248, 250, 252, 0.9);
      }

      th,
      td {
        padding: 1rem;
        text-align: left;
      }

      th {
        font-weight: 600;
        color: rgba(15, 23, 42, 0.8);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }

      .empty-state td {
        text-align: center;
        color: rgba(15, 23, 42, 0.55);
        font-style: italic;
      }

      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }

      @media (max-width: 960px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .actions {
          flex-direction: column;
          width: 100%;
        }

        .search-input {
          max-width: none;
          width: 100%;
        }
      }
    `,
  ],
  imports: [CommonModule, FormsModule, TuiButton, ...TuiTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListPage {
  private readonly router = inject(Router);

  searchTerm = '';

  goToSale(): void {
    this.router.navigate(['/vendas/nova']);
  }
}
