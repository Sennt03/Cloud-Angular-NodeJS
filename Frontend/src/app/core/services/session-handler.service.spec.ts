import { TestBed } from '@angular/core/testing';

import { SessionHandlerService } from './session-handler.service';

describe('SessionHandlerService', () => {
  let service: SessionHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
