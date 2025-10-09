import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiLink } from '@taiga-ui/core';
import { TuiTable } from '@taiga-ui/addon-table/components/table';

import { Product } from '../core/products.service';
import { ProductsStore } from '../core/products.store';

@Component({
  standalone: true,
  selector: 'app-products-list-page',
  template: `
    <section class="page">
      <header class="page-header">
        <div class="page-heading">
          <nav class="breadcrumbs" aria-label="Navegação secundária">
            <a tuiLink routerLink="/produtos">Produtos</a>
            <span class="divider" aria-hidden="true">/</span>
            <span class="current">Lista</span>
          </nav>
          <h1>Produtos</h1>
          <p class="subtitle">Gerencie o catálogo e mantenha o estoque em dia.</p>
        </div>
        <button tuiButton appearance="primary" size="m" class="cta-button" (click)="goToSale()">
          Registrar Venda
        </button>
      </header>

      <div class="page-toolbar">
        <label class="search-field">
          <span class="visually-hidden">Buscar produtos</span>
          <svg class="search-icon" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M13.29 12.17a6 6 0 1 0-1.11 1.11l3.7 3.7a.78.78 0 0 0 1.11-1.11zm-5.29.83a4.5 4.5 0 1 1 4.5-4.5 4.5 4.5 0 0 1-4.5 4.5z"
            />
          </svg>
          <input
            type="search"
            [(ngModel)]="searchTerm"
            class="search-input"
            placeholder="Buscar por nome ou SKU"
          />
        </label>
      </div>

      <div class="table-container">
        <table tuiTable [columns]="columns" class="product-table">
          <thead>
            <tr>
              <th *ngFor="let label of headerLabels">{{ label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let product of filteredProducts; trackBy: trackByProductId"
              class="product-row"
            >
              <td>
                <button
                  type="button"
                  tuiLink
                  class="sku-link"
                  (click)="openProduct(product.id)"
                >
                  {{ product.sku }}
                </button>
              </td>
              <td>{{ product.name }}</td>
              <td>{{ formatPrice(product.price) }}</td>
              <td [class.low-stock]="product.quantity === 0">
                {{ product.quantity }}
              </td>
              <td class="actions-cell">
                <button
                  type="button"
                  tuiButton
                  appearance="flat"
                  size="s"
                  class="icon-button"
                  (click)="openProduct(product.id)"
                  aria-label="Editar produto"
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      d="M14.83 2.17a2.29 2.29 0 0 1 3.24 3.24l-.9.9-3.24-3.24zm-2 2L3 14v3h3l9.83-9.83z"
                    />
                  </svg>
                </button>
              </td>
            </tr>

            <tr *ngIf="!store.loading() && filteredProducts.length === 0" class="empty-state">
              <td colspan="5">Nenhum produto encontrado.</td>
            </tr>
          </tbody>
        </table>

        <div class="loading-overlay" *ngIf="store.loading()">
          <span class="loading-text">Carregando...</span>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding-bottom: 2rem;
      }

      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
      }

      .page-heading {
        display: flex;
        flex-direction: column;
      }

      .breadcrumbs {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: rgba(15, 23, 42, 0.6);
      }

      .breadcrumbs .current {
        font-weight: 600;
        color: rgba(15, 23, 42, 0.7);
      }

      .page-heading h1 {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        color: rgba(15, 23, 42, 0.92);
      }

      .subtitle {
        margin: 0.25rem 0 0;
        color: rgba(15, 23, 42, 0.6);
      }

      .cta-button {
        flex-shrink: 0;
      }

      .page-toolbar {
        display: flex;
        justify-content: flex-end;
      }

      .search-field {
        position: relative;
        display: inline-flex;
        align-items: center;
        min-width: 280px;
        max-width: 360px;
        width: 100%;
        background: #f6f7fb;
        border-radius: 999px;
        padding: 0.3rem 0.75rem;
        border: 1px solid rgba(15, 23, 42, 0.05);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .search-field:focus-within {
        border-color: rgba(37, 99, 235, 0.4);
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
      }

      .search-icon {
        width: 18px;
        height: 18px;
        margin-right: 0.75rem;
        fill: rgba(15, 23, 42, 0.4);
      }

      .search-input {
        border: none;
        background: transparent;
        width: 100%;
        font-size: 0.95rem;
        color: rgba(15, 23, 42, 0.9);
      }

      .search-input:focus {
        outline: none;
      }

      .table-container {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: #ffffff;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      thead {
        background: rgba(245, 246, 251, 0.85);
      }

      th,
      td {
        padding: 1rem 1.25rem;
        text-align: left;
      }

      th {
        font-weight: 600;
        color: rgba(15, 23, 42, 0.65);
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      tbody tr {
        background: #fff;
        transition: background 0.2s ease;
      }

      tbody tr:not(:last-child) {
        border-bottom: 1px solid rgba(15, 23, 42, 0.05);
      }

      tbody tr:hover {
        background: rgba(37, 99, 235, 0.04);
      }

      .sku-link {
        font-weight: 600;
        color: #2563eb;
        padding: 0;
      }

      .sku-link:hover {
        text-decoration: underline;
      }

      .actions-cell {
        width: 120px;
      }

      .icon-button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .icon-button svg {
        width: 18px;
        height: 18px;
        fill: rgba(15, 23, 42, 0.6);
      }

      .icon-button:hover svg {
        fill: #1d4ed8;
      }

      .low-stock {
        color: #dc2626;
        font-weight: 600;
      }

      .empty-state td {
        text-align: center;
        padding: 2.5rem 1.25rem;
        color: rgba(15, 23, 42, 0.55);
        font-size: 0.95rem;
      }

      .loading-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(3px);
        font-weight: 600;
        color: rgba(15, 23, 42, 0.6);
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

        .page-toolbar {
          justify-content: stretch;
        }

        .search-field {
          max-width: none;
          width: 100%;
        }

        .actions-cell {
          width: auto;
        }
      }
    `,
  ],
  imports: [CommonModule, FormsModule, RouterLink, TuiButton, TuiLink, ...TuiTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListPage {
  readonly store = inject(ProductsStore);
  private readonly router = inject(Router);

  searchTerm = '';
  readonly columns: Array<keyof Product | string> = ['sku', 'name', 'price', 'quantity', 'actions'];
  readonly headerLabels = ['SKU', 'Nome', 'Preço', 'Quantidade', 'Ações'];

  constructor() {
    void this.store.loadAll();
  }

  get filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();
    const products = this.store.products();

    if (!term) {
      return products;
    }

    return products.filter((product) => {
      const values = [product.sku, product.name];
      return values.some((value) => value.toLowerCase().includes(term));
    });
  }

  goToSale(): void {
    this.router.navigate(['/vendas/nova']);
  }

  openProduct(id: number): void {
    this.router.navigate(['/produtos', id]);
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }

  formatPrice(value: string): string {
    const numeric = Number(value);

    if (Number.isNaN(numeric)) {
      return value;
    }

    return numeric.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  }
}
