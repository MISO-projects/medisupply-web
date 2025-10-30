import { TestBed } from '@angular/core/testing';
import { ConductorService } from './conductores.service';

describe('ConductorService', () => {
  let service: ConductorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConductorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});




