import { Component, OnInit } from '@angular/core';
import { ListConfig } from '../../../components/list-items/list-items.component';
import { ListItemsComponent } from '../../../components/list-items/list-items.component';
import { SuppliersService, Proveedor, ListarProveedoresParams, PaisEnum, TipoProveedorEnum } from '../../../services/suppliers.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css'],
  imports: [ListItemsComponent],
  standalone: true
})
export class SupplierListComponent implements OnInit {
  listConfig: ListConfig = {
    title: 'Proveedores',
    columns: [
      { key: 'nombre', label: 'Nombre', sortable: true },
      { key: 'tipo_proveedor', label: 'Tipo', sortable: true },
      { key: 'id_tributario', label: 'RUC / NIT / ID tributario', sortable: true },
      { key: 'pais', label: 'País', sortable: true },
      { key: 'contacto', label: 'Contacto', sortable: true }
    ],
    actions: [
      { label: 'Editar', action: 'edit', color: 'secondary' },
      { label: 'Eliminar', action: 'delete', color: 'danger' }
    ],
    showItemActions: true,
    showCreateButton: true,
    createButtonLabel: 'Crear',
    showUploadButton: false,
    uploadButtonLabel: 'Subir'
  };

  suppliers: Proveedor[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;

  // Filter options
  filterParams: ListarProveedoresParams = {};

  constructor(private suppliersService: SuppliersService) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.error = null;

    const params: ListarProveedoresParams = {
      ...this.filterParams,
      page: this.currentPage,
      page_size: this.pageSize
    };

    this.suppliersService.listarProveedores(params).subscribe({
      next: (response) => {
        this.suppliers = response.data;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los proveedores';
        this.loading = false;
        console.error('Error loading suppliers:', error);
      }
    });
  }

  onCreateSupplier(): void {
    console.log('Crear nuevo proveedor');
    // TODO: Implementar navegación a formulario de creación
    // this.router.navigate(['/suppliers/create']);
  }

  onUploadSuppliers(): void {
    throw new Error('Not implemented');
  }

  onSupplierAction(event: {action: string, item: Proveedor}): void {
    console.log('Acción:', event.action, 'Proveedor:', event.item);
    
    switch (event.action) {
      case 'edit':
        this.editSupplier(event.item);
        break;
      case 'delete':
        this.deleteSupplier(event.item);
        break;
      default:
        console.log('Acción no reconocida:', event.action);
    }
  }

  editSupplier(supplier: Proveedor): void {
    console.log('Editar proveedor:', supplier);
    // TODO: Implementar navegación a formulario de edición
    // this.router.navigate(['/suppliers/edit', supplier.id]);
  }

  deleteSupplier(supplier: Proveedor): void {
    if (confirm(`¿Está seguro de que desea eliminar el proveedor "${supplier.nombre}"?`)) {
      this.loading = true;
      this.suppliersService.eliminarProveedor(supplier.id).subscribe({
        next: (response) => {
          console.log('Proveedor eliminado:', response);
          this.loadSuppliers();
        },
        error: (error) => {
          this.error = 'Error al eliminar el proveedor';
          this.loading = false;
          console.error('Error deleting supplier:', error);
        }
      });
    }
  }

  onSortSuppliers(event: {column: string, direction: 'asc' | 'desc'}): void {
    console.log('Ordenar por:', event.column, 'Dirección:', event.direction);
    // TODO: Implementar lógica de ordenamiento en el backend
    this.loadSuppliers();
  }

  filterByCountry(country: PaisEnum | null): void {
    this.filterParams.pais = country;
    this.currentPage = 1;
    this.loadSuppliers();
  }

  filterByType(type: TipoProveedorEnum | null): void {
    this.filterParams.tipo_proveedor = type;
    this.currentPage = 1;
    this.loadSuppliers();
  }

  clearFilters(): void {
    this.filterParams = {};
    this.currentPage = 1;
    this.loadSuppliers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSuppliers();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadSuppliers();
  }
}
