import { TestBed } from '@angular/core/testing';

import { NgxCoreService } from './ngx-core.service';

describe('NgxCoreService', () => {
  let service: NgxCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
