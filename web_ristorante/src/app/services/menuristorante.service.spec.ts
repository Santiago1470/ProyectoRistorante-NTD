import { TestBed } from '@angular/core/testing';

import { MenuristoranteService } from './menuristorante.service';

describe('MenuristoranteService', () => {
  let service: MenuristoranteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuristoranteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
