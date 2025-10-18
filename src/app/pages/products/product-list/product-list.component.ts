import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  DataTableComponent,
  TableColumn,
} from '../../../components/data-table/data-table.component';
import { ProductService } from '../../../services/products.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, DataTableComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  isLoading = false;
  error: string | null = null;

  columns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'sku', label: 'SKU' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'proveedor_nombre', label: 'Proveedor' },
    { key: 'precio_unitario', label: 'Precio unitario' },
  ];

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar los productos. Por favor, intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
