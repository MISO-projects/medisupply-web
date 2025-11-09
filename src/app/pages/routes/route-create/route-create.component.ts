import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RouteService } from '../../../services/routes.service';
import { VehiculoService } from '../../../services/vehiculos.service';
import { ConductorService } from '../../../services/conductores.service';
import { PedidoService } from '../../../services/pedidos.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';
import { CommonModule } from '@angular/common';
import { Vehiculo } from '../../../models/vehiculo.model';
import { Conductor } from '../../../models/conductor.model';
import { Pedido } from '../../../models/pedido.model';

@Component({
  selector: 'app-route-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './route-create.component.html',
  styleUrls: ['./route-create.component.css'],
})
export class RouteCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private routeService = inject(RouteService);
  private vehiculoService = inject(VehiculoService);
  private conductorService = inject(ConductorService);
  private pedidoService = inject(PedidoService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;
  isLoadingPedidos = false;
  vehiculos: Vehiculo[] = [];
  conductores: Conductor[] = [];
  pedidos: Pedido[] = [];
  bodegas = ['Bodega Central', 'Bodega Norte', 'Bodega Sur', 'Bodega Occidente'];
  estados = ['Pendiente', 'En Curso', 'Completada', 'Cancelada'];
  condicionesAlmacenamiento = ['Ambiente', 'Refrigerado', 'Congelado', 'Controlado'];

  routeForm: FormGroup = this.fb.group({
    fecha: ['', [Validators.required]],
    bodega_origen: ['', [Validators.required]],
    estado: ['Pendiente', [Validators.required]],
    vehiculo_id: ['', [Validators.required]],
    conductor_id: ['', [Validators.required]],
    condiciones_almacenamiento: [''],
    paradas: this.fb.array([]),
  });

  get paradas(): FormArray {
    return this.routeForm.get('paradas') as FormArray;
  }

  constructor() {
    // Agregar una parada inicial
    this.addParada();
  }

  ngOnInit(): void {
    this.loadVehiculos();
    this.loadConductores();
    this.loadPedidos();
  }

  private loadVehiculos(): void {
    this.vehiculoService.getVehiculos(1, 100, true).subscribe({
      next: (vehiculos: Vehiculo[]) => {
        this.vehiculos = vehiculos;
      },
      error: (err: Error) => {
        console.error('Error al cargar vehículos:', err);
      },
    });
  }

  private loadConductores(): void {
    this.conductorService.getConductores(1, 100, true).subscribe({
      next: (conductores: Conductor[]) => {
        this.conductores = conductores;
      },
      error: (err: Error) => {
        console.error('Error al cargar conductores:', err);
      },
    });
  }

  private loadPedidos(): void {
    this.isLoadingPedidos = true;
    this.pedidoService.getPedidosPendientes().subscribe({
      next: (pedidos: Pedido[]) => {
        this.pedidos = pedidos;
        this.isLoadingPedidos = false;
      },
      error: (err: Error) => {
        console.error('Error al cargar pedidos:', err);
        this.pedidos = [];
        this.isLoadingPedidos = false;
      },
    });
  }

  createParadaForm(): FormGroup {
    return this.fb.group({
      pedido_id: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      contacto: [''],
      latitud: [0],
      longitud: [0],
    });
  }

  addParada(): void {
    this.paradas.push(this.createParadaForm());
  }

  removeParada(index: number): void {
    if (this.paradas.length > 1) {
      this.paradas.removeAt(index);
    }
  }

  onPedidoSelected(event: any, index: number): void {
    const pedidoId = event.value;
    const pedidoSeleccionado = this.pedidos.find((p) => p.id === pedidoId);
    const paradaForm = this.paradas.at(index) as FormGroup;

    if (pedidoSeleccionado) {
      // Autocompletar dirección y contacto si están disponibles en el pedido
      if (pedidoSeleccionado.direccion_entrega && !paradaForm.get('direccion')?.value) {
        paradaForm.patchValue({
          direccion: pedidoSeleccionado.direccion_entrega,
        });
      }
      if (pedidoSeleccionado.contacto && !paradaForm.get('contacto')?.value) {
        paradaForm.patchValue({
          contacto: pedidoSeleccionado.contacto,
        });
      }
    }
  }

  onSubmit(): void {
    if (this.routeForm.invalid) {
      this.routeForm.markAllAsTouched();
      this.markFormGroupTouched(this.routeForm);
      return;
    }

    this.isLoading = true;

    // Obtener información del vehículo y conductor seleccionados
    const vehiculoSeleccionado = this.vehiculos.find(
      (v) => v.id === this.routeForm.value.vehiculo_id,
    );
    const conductorSeleccionado = this.conductores.find(
      (c) => c.id === this.routeForm.value.conductor_id,
    );

    // Formatear los datos para enviar al backend
    const formData = {
      fecha: this.formatDate(this.routeForm.value.fecha),
      bodega_origen: this.routeForm.value.bodega_origen,
      estado: this.routeForm.value.estado,
      vehiculo_id: this.routeForm.value.vehiculo_id,
      conductor_id: this.routeForm.value.conductor_id,
      vehiculo_placa: vehiculoSeleccionado?.placa || '',
      vehiculo_info: `${vehiculoSeleccionado?.marca} ${vehiculoSeleccionado?.modelo}` || '',
      conductor_nombre: conductorSeleccionado?.nombre_completo || '',
      condiciones_almacenamiento: this.routeForm.value.condiciones_almacenamiento,
      paradas: this.routeForm.value.paradas.map((parada: any, index: number) => {
        const pedidoSeleccionado = this.pedidos.find((p) => p.id === parada.pedido_id);
        return {
          pedido_id: parada.pedido_id,
          direccion: parada.direccion || pedidoSeleccionado?.direccion_entrega || '',
          contacto: parada.contacto || pedidoSeleccionado?.contacto || '',
          latitud: parseFloat(parada.latitud) || 0,
          longitud: parseFloat(parada.longitud) || 0,
          orden: index + 1,
        };
      }),
    };

    this.routeService.createRoute(formData).subscribe({
      next: () => {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Ruta creada exitosamente' },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/routes']);
      },
      error: (err) => {
        console.error('Error al crear ruta:', err);
        const errorMessage =
          err.error?.detail?.detail || 'Error al crear la ruta. Por favor, intenta de nuevo.';
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: errorMessage },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/routes']);
  }

  private formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
