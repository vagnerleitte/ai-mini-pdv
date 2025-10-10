import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiLink } from '@taiga-ui/core';
import { TuiAlertService as TuiNotificationsService } from '@taiga-ui/core';

import { ProductsStore } from '../core/products.store';
import { CreateProductDto } from '../core/products.service';

type ProductFormControlName = 'sku' | 'name' | 'price' | 'quantity';

@Component({
  standalone: true,
  selector: 'app-product-create-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TuiButton,
    TuiLink,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <nav class="breadcrumbs" aria-label="Navegação secundária">
          <a tuiLink routerLink="/produtos">Produtos</a>
          <span class="divider" aria-hidden="true">/</span>
          <span class="current">Novo</span>
        </nav>

        <div class="page-heading">
          <h1>Novo Produto</h1>
          <p class="subtitle">
            Cadastre itens com SKU, preço e estoque para completar o catálogo.
          </p>
        </div>
      </header>

      <div class="form-wrapper">
        <form
          class="form-card"
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          [attr.aria-busy]="loading() ? 'true' : 'false'"
        >
          <fieldset class="form-fields" [disabled]="loading()">
            <div class="form-field">
              <label class="field-label" for="sku">SKU</label>
              <input
                id="sku"
                type="text"
                autocomplete="off"
                formControlName="sku"
                class="text-input"
                placeholder="Ex.: SKU-001"
              />
              <span class="field-error" *ngIf="hasError('sku')">
                {{ getErrorMessage('sku') }}
              </span>
            </div>

            <div class="form-field name-field">
              <label class="field-label" for="name">Nome</label>
              <input
                id="name"
                type="text"
                autocomplete="off"
                formControlName="name"
                class="text-input"
                placeholder="Nome do produto"
              />
              <span class="field-error" *ngIf="hasError('name')">
                {{ getErrorMessage('name') }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label" for="price">Preço</label>
              <input
                id="price"
                type="text"
                inputmode="decimal"
                autocomplete="off"
                formControlName="price"
                class="text-input"
                placeholder="Ex.: 199.90"
              />
              <span class="field-error" *ngIf="hasError('price')">
                {{ getErrorMessage('price') }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label" for="quantity">Quantidade</label>
              <input
                id="quantity"
                type="number"
                min="0"
                step="1"
                inputmode="numeric"
                formControlName="quantity"
                class="text-input"
                placeholder="0"
              />
              <span class="field-error" *ngIf="hasError('quantity')">
                {{ getErrorMessage('quantity') }}
              </span>
            </div>
          </fieldset>

          <div class="form-actions">
            <button
              tuiButton
              appearance="primary"
              size="m"
              type="submit"
              [disabled]="loading() || form.invalid"
            >
              Salvar Produto
            </button>
            <button
              tuiButton
              appearance="flat"
              size="m"
              type="button"
              class="secondary-button"
              (click)="onReset()"
              [disabled]="loading() || resetDisabled()"
            >
              Limpar Campos
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .page {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
        padding-bottom: 2.5rem;
      }

      .page-header {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .breadcrumbs {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: rgba(15, 23, 42, 0.55);
      }

      .breadcrumbs .current {
        font-weight: 600;
        color: rgba(15, 23, 42, 0.75);
      }

      .page-heading h1 {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        color: rgba(15, 23, 42, 0.92);
      }

      .subtitle {
        margin: 0.25rem 0 0;
        color: rgba(15, 23, 42, 0.55);
      }

      .form-wrapper {
        display: flex;
        justify-content: center;
      }

      .form-card {
        width: 100%;
        max-width: 720px;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-fields {
        border: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      .form-field.name-field {
        grid-column: span 2;
      }

      .field-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: rgba(15, 23, 42, 0.82);
      }

      .text-input {
        border: 1px solid rgba(15, 23, 42, 0.1);
        border-radius: 12px;
        padding: 0.75rem 0.9rem;
        font-size: 0.975rem;
        color: rgba(15, 23, 42, 0.92);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .text-input:focus {
        outline: none;
        border-color: rgba(37, 99, 235, 0.45);
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      .text-input:disabled {
        background: rgba(15, 23, 42, 0.03);
      }

      .field-error {
        font-size: 0.8125rem;
        color: #d14343;
      }

      .form-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
      }

      .secondary-button {
        color: rgba(15, 23, 42, 0.8);
      }

      @media (max-width: 720px) {
        .form-card {
          padding: 1.5rem;
        }

        .form-fields {
          grid-template-columns: 1fr;
        }

        .form-field.name-field {
          grid-column: span 1;
        }

        .form-actions {
          flex-direction: column-reverse;
          align-items: stretch;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCreatePage {
  private static readonly PRICE_PATTERN = /^\d+(?:[.,]\d{1,2})?$/;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly notifications = inject(TuiNotificationsService);
  protected readonly store = inject(ProductsStore);
  protected readonly loading = this.store.loading;

  private readonly submitted = signal(false);

  readonly form = this.fb.group({
    sku: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    name: this.fb.nonNullable.control('', [Validators.required]),
    price: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.pattern(ProductCreatePage.PRICE_PATTERN),
    ]),
    quantity: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
  });

  async onSubmit(): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const { sku, name, price, quantity } = this.form.getRawValue();
    const dto: CreateProductDto = {
      sku: sku.trim(),
      name: name.trim(),
      price: this.normalizePrice(price),
      quantity: Number(quantity),
    };

    const success = await this.store.create(dto);

    if (!success) {
      const message =
        this.store.error() ?? 'Não foi possível criar o produto.';

      this.notifications
        .open(message, { appearance: 'negative' })
        .subscribe();
      return;
    }

    this.notifications
      .open('Produto criado com sucesso!', { appearance: 'positive' })
      .subscribe();

    this.form.reset();
    this.submitted.set(false);
    void this.router.navigate(['/produtos']);
  }

  onReset(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.submitted.set(false);
  }

  resetDisabled(): boolean {
    return this.form.pristine && !this.submitted();
  }

  hasError(controlName: ProductFormControlName): boolean {
    const control = this.form.controls[controlName];
    return (
      control.invalid &&
      (control.dirty || control.touched || this.submitted())
    );
  }

  getErrorMessage(controlName: ProductFormControlName): string | null {
    const control = this.form.controls[controlName];

    if (!this.hasError(controlName)) {
      return null;
    }

    if (control.hasError('required')) {
      return 'Campo obrigatório';
    }

    if (controlName === 'sku' && control.hasError('minlength')) {
      return 'Mínimo de 3 caracteres';
    }

    if (controlName === 'price' && control.hasError('pattern')) {
      return 'Valor inválido';
    }

    if (controlName === 'quantity' && control.hasError('min')) {
      return 'Valor inválido';
    }

    return 'Valor inválido';
  }

  private normalizePrice(value: string): string {
    const sanitized = value.replace(',', '.').trim();
    const numeric = Number(sanitized);

    if (Number.isNaN(numeric)) {
      return sanitized;
    }

    return numeric.toFixed(2);
  }
}
