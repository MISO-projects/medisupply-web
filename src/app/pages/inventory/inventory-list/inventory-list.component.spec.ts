import { ComponentFixture, TestBed } from '@angular/core/testing'; // ¡Quitamos fakeAsync y tick!
import { of, throwError } from 'rxjs';
import { InventoryListComponent } from './inventory-list.component';
import { InventoryService } from '../../../services/inventory.service';
import { InventoryItem } from '../../../models/inventory.model';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  DataTableComponent,
  TableColumn,
} from '../../../components/data-table/data-table.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data-table',
  template: '',
  standalone: true,
})
class MockDataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
}

// --- (Mock Data) ---
const mockInventoryItems: InventoryItem[] = [
  {
    id: 'uuid-1',
    producto_id: 'prod-1',
    lote: 'LOTE-A',
    fecha_vencimiento: '2025-12-01',
    cantidad: 100,
    ubicacion: 'Bodega A',
    temperatura_requerida: 'AMBIENTE',
    estado: 'DISPONIBLE',
    fecha_recepcion: '2025-10-30T10:00:00Z',
    producto_nombre: 'Producto 1',
    producto_sku: 'SKU-001',
    created_at: '2025-10-30T10:00:00Z',
    updated_at: null,
  },
  {
    id: 'uuid-2',
    producto_id: 'prod-2',
    lote: 'LOTE-B',
    fecha_vencimiento: '2026-01-01',
    cantidad: 50,
    ubicacion: 'Bodega B',
    temperatura_requerida: 'REFRIGERADO',
    estado: 'DISPONIBLE',
    fecha_recepcion: '2025-10-30T11:00:00Z',
    producto_nombre: 'Producto 2',
    producto_sku: 'SKU-002',
    created_at: '2025-10-30T11:00:00Z',
    updated_at: null,
  },
];

describe('InventoryListComponent', () => {
  let component: InventoryListComponent;
  let fixture: ComponentFixture<InventoryListComponent>;
  let inventoryService: jasmine.SpyObj<InventoryService>;

  beforeEach(async () => {
    const inventoryServiceSpy = jasmine.createSpyObj('InventoryService', ['getInventory']);

    await TestBed.configureTestingModule({
      imports: [
        InventoryListComponent,
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MockDataTableComponent,
      ],
      providers: [
        { provide: InventoryService, useValue: inventoryServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
      ],
    })
      .overrideComponent(InventoryListComponent, {
        remove: { imports: [DataTableComponent] },
        add: { imports: [MockDataTableComponent] },
      })
      .compileComponents();

    inventoryService = TestBed.inject(InventoryService) as jasmine.SpyObj<InventoryService>;

    fixture = TestBed.createComponent(InventoryListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    inventoryService.getInventory.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load, map, and display inventory on init (Happy Path)', () => {
    inventoryService.getInventory.and.returnValue(of(mockInventoryItems));

    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
    expect(component.inventoryItems.length).toBe(2);
    expect(component.inventoryItems[0].producto_completo).toBe('Producto 1 (SKU-001)');
    expect(component.error).toBeNull();
  });

  it('should set error state if loading fails (Sad Path)', () => {
    inventoryService.getInventory.and.returnValue(throwError(() => new Error('Error de red')));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error al cargar el inventario. Por favor, intenta de nuevo.');
    expect(component.inventoryItems.length).toBe(0);
  });

  it('should have the correct columns defined', () => {
    expect(component.columns.length).toBe(6);
    expect(component.columns[0].key).toBe('producto_completo');
  });
});
