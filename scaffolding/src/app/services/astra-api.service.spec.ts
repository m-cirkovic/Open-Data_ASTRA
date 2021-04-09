import { TestBed } from '@angular/core/testing';

import { AstraApiService } from './astra-api.service';

describe('AstraApiService', () => {
  let service: AstraApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AstraApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
