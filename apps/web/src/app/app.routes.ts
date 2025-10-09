import { Routes } from '@angular/router';

import { ProductCreatePage } from './pages/product-create.page';
import { ProductDetailsPage } from './pages/product-details.page';
import { ProductsListPage } from './pages/products-list.page';
import { SaleCreatePage } from './pages/sale-create.page';
import { StockEntryPage } from './pages/stock-entry.page';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'produtos',
  },
  {
    path: 'produtos',
    component: ProductsListPage,
  },
  {
    path: 'produtos/novo',
    component: ProductCreatePage,
  },
  {
    path: 'produtos/:id',
    component: ProductDetailsPage,
  },
  {
    path: 'estoque/entrada',
    component: StockEntryPage,
  },
  {
    path: 'vendas/nova',
    component: SaleCreatePage,
  },
  {
    path: '**',
    redirectTo: 'produtos',
  },
];
