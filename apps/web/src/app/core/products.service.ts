import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvConfig } from './env-config';

export interface Product {
  id: number;
  sku: string;
  name: string;
  price: string;
  quantity: number;
}

export type CreateProductDto = Pick<Product, 'sku' | 'name' | 'price' | 'quantity'>;

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(EnvConfig);
  private readonly baseUrl = `${this.env.apiBase.replace(/\/$/, '')}/api/products`;

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, dto);
  }

  stockIn(id: number, qty: number): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}/in`, { qty });
  }

  sell(id: number, qty: number): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}/out`, { qty });
  }
}
