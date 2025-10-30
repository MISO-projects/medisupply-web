import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductorCreateComponent } from './conductor-create.component';

describe('ConductorCreateComponent', () => {
  let component: ConductorCreateComponent;
  let fixture: ComponentFixture<ConductorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConductorCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConductorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

