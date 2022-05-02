import { TestBed } from '@angular/core/testing';

import { FacultyApiService } from './faculty-api.service';

describe('FacultyApiService', () => {
  let service: FacultyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
