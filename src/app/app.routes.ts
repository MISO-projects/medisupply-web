import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth routes (without layout)
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
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
      {
        path: 'products/create-bulk',
        loadComponent: () =>
          import('./pages/products/product-create-bulk/product-create-bulk.component').then(
            (m) => m.ProductCreateBulkComponent,
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

      // Sales Plans routes
      {
        path: 'sales-plans',
        loadComponent: () =>
          import('./pages/sales-plans/sales-plan-list/sales-plan-list.component').then(
            (m) => m.SalesPlanListComponent,
          ),
      },
      {
        path: 'sales-plans/create',
        loadComponent: () =>
          import('./pages/sales-plans/sales-plan-create/sales-plan-create.component').then(
            (m) => m.SalesPlanCreateComponent,
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./pages/inventory/inventory-list/inventory-list.component').then(
            (m) => m.InventoryListComponent,
          ),
      },
      {
        path: 'inventory/create',
        loadComponent: () =>
          import('./pages/inventory/inventory-create/inventory-create.component').then(
            (m) => m.InventoryCreateComponent,
          ),
      },
      // Routes (Logística) routes
      {
        path: 'routes',
        loadComponent: () =>
          import('./pages/routes/route-list/route-list.component').then(
            (m) => m.RouteListComponent,
          ),
      },
      {
        path: 'routes/create',
        loadComponent: () =>
          import('./pages/routes/route-create/route-create.component').then(
            (m) => m.RouteCreateComponent,
          ),
      },
      {
        path: 'routes/:id',
        loadComponent: () =>
          import('./pages/routes/route-detail/route-detail.component').then(
            (m) => m.RouteDetailComponent,
          ),
      },

      // Conductores routes
      {
        path: 'conductores',
        loadComponent: () =>
          import('./pages/conductores/conductor-list/conductor-list.component').then(
            (m) => m.ConductorListComponent,
          ),
      },
      {
        path: 'conductores/create',
        loadComponent: () =>
          import('./pages/conductores/conductor-create/conductor-create.component').then(
            (m) => m.ConductorCreateComponent,
          ),
      },

      // Vehículos routes
      {
        path: 'vehiculos',
        loadComponent: () =>
          import('./pages/vehiculos/vehiculo-list/vehiculo-list.component').then(
            (m) => m.VehiculoListComponent,
          ),
      },
      {
        path: 'vehiculos/create',
        loadComponent: () =>
          import('./pages/vehiculos/vehiculo-create/vehiculo-create.component').then(
            (m) => m.VehiculoCreateComponent,
          ),
      },

      // Reports routes
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/sales-report.component').then((m) => m.SalesReportComponent),
      },
    ],
  },
];
