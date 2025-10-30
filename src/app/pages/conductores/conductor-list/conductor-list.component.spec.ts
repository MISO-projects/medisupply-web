import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConductorListComponent } from './conductor-list.component';
import { ConductorService } from '../../../services/conductores.service';
import { Conductor } from '../../../models/conductor.model';

describe('ConductorListComponent', () => {
  let component: ConductorListComponent;
  let fixture: ComponentFixture<ConductorListComponent>;
  let conductorService: jasmine.SpyObj<ConductorService>;

  const mockConductores: Conductor[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      documento: '12345678',
      licencia_conducir: 'LIC123456',
      activo: true,
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'García',
      documento: '87654321',
      licencia_conducir: 'LIC789012',
      activo: true,
    },
  ];

  beforeEach(async () => {
    const conductorServiceSpy = jasmine.createSpyObj('ConductorService', ['getConductores']);

    await TestBed.configureTestingModule({
      imports: [ConductorListComponent, NoopAnimationsModule],
      providers: [{ provide: ConductorService, useValue: conductorServiceSpy }],
    }).compileComponents();

    conductorService = TestBed.inject(ConductorService) as jasmine.SpyObj<ConductorService>;
  });

  beforeEach(() => {
    conductorService.getConductores.and.returnValue(of(mockConductores));
    fixture = TestBed.createComponent(ConductorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load conductores on init', () => {
    expect(conductorService.getConductores).toHaveBeenCalled();
    expect(component.conductores.length).toBe(2);
  });

  it('should define columns correctly', () => {
    expect(component.columns.length).toBeGreaterThan(0);
    expect(component.columns[0].key).toBe('id');
  });

  it('should handle error when loading fails', () => {
    conductorService.getConductores.and.returnValue(throwError(() => ({ status: 500 })));
    fixture = TestBed.createComponent(ConductorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBe(false);
  });
});
