import { TestBed, inject } from '@angular/core/testing';

import { SerachRankingService } from './serach-ranking.service';

describe('SerachRankingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SerachRankingService]
    });
  });

  it('should be created', inject([SerachRankingService], (service: SerachRankingService) => {
    expect(service).toBeTruthy();
  }));
});
