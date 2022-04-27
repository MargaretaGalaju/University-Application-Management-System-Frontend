import { TestBed } from '@angular/core/testing';

import { UiActionService } from './ui-action.service';

describe('UiActionService', () => {
  let service: UiActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
