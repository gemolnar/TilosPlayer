import { TestBed } from '@angular/core/testing';

import { LocalAudioPlayerService } from './local-audio-player.service';

describe('LocalAudioPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalAudioPlayerService = TestBed.get(LocalAudioPlayerService);
    expect(service).toBeTruthy();
  });
});
