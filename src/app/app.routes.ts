import { Routes } from '@angular/router';

import { ProductList } from './features/products/product-list/product-list';
import { ProductDetails } from './features/products/product-details/product-details';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
  {
    path: '',
    component: ProductList
  },
  {
    path: 'products',
    component: ProductList
  },
  {
    path: 'products/:id',
    component: ProductDetails
  },
  {
    path: 'login',
    component: Login
  }
];