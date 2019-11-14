import { TestBed } from '@angular/core/testing';

import { GeekServiceService } from './geek-service.service';

describe('GeekServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeekServiceService = TestBed.get(GeekServiceService);
    expect(service).toBeTruthy();
  });
});
