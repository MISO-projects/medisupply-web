import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, MatIconModule, MatDividerModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  protected readonly navSections = signal<NavSection[]>([
    {
      title: 'Catálogo',
      items: [
        { label: 'Proveedores', route: '/proveedores', icon: 'business' },
        { label: 'Productos', route: '/productos', icon: 'inventory_2' }
      ]
    },
    {
      title: 'Ventas',
      items: [
        { label: 'Vendedores', route: '/vendedores', icon: 'person' },
        { label: 'Planes de venta', route: '/planes', icon: 'sell' }
      ]
    },
    {
      title: 'Operaciones',
      items: [
        { label: 'Logística', route: '/logistica', icon: 'local_shipping' },
        { label: 'Inventario', route: '/inventario', icon: 'warehouse' }
      ]
    },
    {
      title: 'Monitoreo y alertas',
      items: [
        { label: 'Reportes', route: '/reportes', icon: 'analytics' },
        { label: 'Alertas', route: '/alertas', icon: 'notifications' }
      ]
    }
  ]);
}
