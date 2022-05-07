import { TestBed } from '@angular/core/testing';

import { RecommendationApiService } from './recommendation-api.service';

describe('RecommendationApiService', () => {
  let service: RecommendationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
