import { TestBed } from '@angular/core/testing';

import { ShowProviderService } from './show-provider.service';

describe('ShowProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowProviderService = TestBed.get(ShowProviderService);
    expect(service).toBeTruthy();
  });
});
