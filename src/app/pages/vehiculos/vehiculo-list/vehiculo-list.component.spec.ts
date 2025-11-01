import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VehiculoListComponent } from './vehiculo-list.component';
import { VehiculoService } from '../../../services/vehiculos.service';
import { Vehiculo } from '../../../models/vehiculo.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('VehiculoListComponent', () => {
  let component: VehiculoListComponent;
  let fixture: ComponentFixture<VehiculoListComponent>;
  let vehiculoService: jasmine.SpyObj<VehiculoService>;

  const mockVehiculos: Vehiculo[] = [
    {
      id: 1,
      placa: 'ABC123',
      marca: 'Toyota',
      modelo: 'Hiace',
      tipo: 'Furgón',
      activo: true,
    },
    {
      id: 2,
      placa: 'XYZ789',
      marca: 'Ford',
      modelo: 'Transit',
      tipo: 'Camión',
      activo: true,
    },
  ];

  beforeEach(async () => {
    const vehiculoServiceSpy = jasmine.createSpyObj('VehiculoService', ['getVehiculos']);

    await TestBed.configureTestingModule({
      imports: [VehiculoListComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [{ provide: VehiculoService, useValue: vehiculoServiceSpy }],
    }).compileComponents();

    vehiculoService = TestBed.inject(VehiculoService) as jasmine.SpyObj<VehiculoService>;
  });

  beforeEach(() => {
    vehiculoService.getVehiculos.and.returnValue(of(mockVehiculos));
    fixture = TestBed.createComponent(VehiculoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load vehiculos on init', () => {
    expect(vehiculoService.getVehiculos).toHaveBeenCalled();
    expect(component.vehiculos.length).toBe(2);
  });

  it('should define columns correctly', () => {
    expect(component.columns.length).toBeGreaterThan(0);
    expect(component.columns[0].key).toBe('id');
  });

  it('should handle error when loading fails', () => {
    vehiculoService.getVehiculos.and.returnValue(throwError(() => ({ status: 500 })));
    fixture = TestBed.createComponent(VehiculoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBe(false);
  });
});
