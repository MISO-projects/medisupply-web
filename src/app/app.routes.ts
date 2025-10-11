import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/suppliers', pathMatch: 'full' },

  // Products routes
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/product-list/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: 'products/create',
    loadComponent: () =>
      import('./pages/products/product-create/product-create.component').then(
        (m) => m.ProductCreateComponent,
      ),
  },

  // Suppliers routes
  {
    path: 'suppliers',
    loadComponent: () =>
      import('./pages/suppliers/supplier-list/supplier-list.component').then(
        (m) => m.SupplierListComponent,
      ),
  },

  // Vendors routes
  {
    path: 'vendors',
    loadComponent: () =>
      import('./pages/vendors/vendor-list/vendor-list.component').then(
        (m) => m.VendorListComponent,
      ),
  },
  {
    path: 'vendors/create',
    loadComponent: () =>
      import('./pages/vendors/vendor-create/vendor-create.component').then(
        (m) => m.VendorCreateComponent,
      ),
  },
];
