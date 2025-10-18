import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth routes (without layout)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },

  // Main app routes (with layout and auth guard)
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
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
      {
        path: 'suppliers/create',
        loadComponent: () =>
          import('./pages/suppliers/supplier-create/supplier-create.component').then(
            (m) => m.SupplierCreateComponent,
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
    ],
  },
];
