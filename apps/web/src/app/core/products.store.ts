import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { TuiAlertService as TuiNotificationsService } from '@taiga-ui/core';
import { firstValueFrom } from 'rxjs';

import {
  CreateProductDto,
  Product,
  ProductsService,
} from './products.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsStore {
  private readonly service = inject(ProductsService);
  private readonly notifications = inject(TuiNotificationsService);

  readonly products = signal<Product[]>([]);
  readonly selected = signal<Product | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly totalItems = computed(() => this.products().length);
  readonly empty = computed(() => this.products().length === 0);
  readonly lowStock = computed(() =>
    this.products().filter((product) => product.quantity === 0),
  );

  async loadAll(): Promise<void> {
    this.setLoading(true);

    try {
      const items = await firstValueFrom(this.service.getAll());
      this.products.set(items);

      const current = this.selected();
      if (current) {
        const next = items.find((item) => item.id === current.id) ?? null;
        this.selected.set(next);
      }

      this.error.set(null);
      console.log('[ProductsStore] total products:', items.length);
    } catch (error) {
      this.handleError(error, 'Não foi possível carregar os produtos.');
    } finally {
      this.setLoading(false);
    }
  }

  async loadOne(id: number): Promise<void> {
    this.setLoading(true);

    try {
      const product = await firstValueFrom(this.service.getById(id));
      this.upsert(product);
      this.selected.set(product);
      this.error.set(null);
    } catch (error) {
      this.handleError(error, 'Não foi possível carregar o produto.');
    } finally {
      this.setLoading(false);
    }
  }

  async create(dto: CreateProductDto): Promise<boolean> {
    this.setLoading(true);

    try {
      const product = await firstValueFrom(this.service.create(dto));
      this.upsert(product);
      this.selected.set(product);
      this.error.set(null);
      return true;
    } catch (error) {
      const message =
        this.extractErrorMessage(error) ??
        'Não foi possível criar o produto.';

      this.error.set(message);
      console.error('[ProductsStore] create failed:', error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async stockIn(id: number, qty: number): Promise<void> {
    this.setLoading(true);

    try {
      const product = await firstValueFrom(this.service.stockIn(id, qty));
      this.upsert(product);
      this.selectedIfMatches(product);
      this.error.set(null);
      this.showSuccess('Entrada registrada');
    } catch (error) {
      this.handleError(error, 'Não foi possível registrar a entrada.');
    } finally {
      this.setLoading(false);
    }
  }

  async sell(id: number, qty: number): Promise<void> {
    this.setLoading(true);

    try {
      const product = await firstValueFrom(this.service.sell(id, qty));
      this.upsert(product);
      this.selectedIfMatches(product);
      this.error.set(null);
      this.showSuccess('Venda registrada');
    } catch (error) {
      this.handleError(error, 'Não foi possível registrar a venda.');
    } finally {
      this.setLoading(false);
    }
  }

  private setLoading(state: boolean): void {
    this.loading.set(state);
  }

  private upsert(product: Product): void {
    this.products.update((current) => {
      const index = current.findIndex((item) => item.id === product.id);

      if (index === -1) {
        return [...current, product];
      }

      const next = [...current];
      next[index] = product;

      return next;
    });

    this.selectedIfMatches(product);
  }

  private selectedIfMatches(product: Product): void {
    const selected = this.selected();

    if (selected?.id === product.id) {
      this.selected.set(product);
    }
  }

  private showSuccess(message: string): void {
    this.notifications
      .open(message, { appearance: 'positive' })
      .subscribe();
  }

  private showError(message: string): void {
    this.notifications
      .open(message, { appearance: 'negative' })
      .subscribe();
  }

  private handleError(error: unknown, fallback: string): void {
    const message = this.extractErrorMessage(error) ?? fallback;
    this.error.set(message);
    this.showError(message);
  }

  private extractErrorMessage(error: unknown): string | null {
    if (error instanceof HttpErrorResponse) {
      const responseError = error.error;
      if (typeof responseError === 'string' && responseError.trim()) {
        return responseError;
      }
      if (
        responseError &&
        typeof responseError === 'object' &&
        'message' in responseError &&
        typeof responseError.message === 'string'
      ) {
        return responseError.message;
      }

      return error.message;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return null;
  }
}

// Exemplo de uso em uma page:
// constructor(private store: ProductsStore) {
//   effect(() => {
//     this.store.loadAll();
//   });
// }
// template: mostrar loading(), products(), empty()
