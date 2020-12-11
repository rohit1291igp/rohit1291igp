import { TestBed, inject } from '@angular/core/testing';

import { EgvService } from './egv.service';

describe('EgvService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EgvService]
    });
  });

  it('should be created', inject([EgvService], (service: EgvService) => {
    expect(service).toBeTruthy();
  }));
});
