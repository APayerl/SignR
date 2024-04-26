import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PGPPublicKeyExtractorComponent } from './pgp-public-key-extractor.component';

describe('PGPPublicKeyExtractorComponent', () => {
  let component: PGPPublicKeyExtractorComponent;
  let fixture: ComponentFixture<PGPPublicKeyExtractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PGPPublicKeyExtractorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PGPPublicKeyExtractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
