import { TestBed } from '@angular/core/testing';

import { FacultyInfoService } from './faculty-info.service';

describe('FacultyInfoService', () => {
  let service: FacultyInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
