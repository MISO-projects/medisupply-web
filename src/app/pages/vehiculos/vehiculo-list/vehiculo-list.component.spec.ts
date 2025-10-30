import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehiculoListComponent } from './vehiculo-list.component';

describe('VehiculoListComponent', () => {
  let component: VehiculoListComponent;
  let fixture: ComponentFixture<VehiculoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculoListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




