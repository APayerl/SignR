import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PGPPublicKeyCombinerComponent } from './pgp-public-key-combiner.component';

describe('PGPPublicKeyCombinerComponent', () => {
  let component: PGPPublicKeyCombinerComponent;
  let fixture: ComponentFixture<PGPPublicKeyCombinerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PGPPublicKeyCombinerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PGPPublicKeyCombinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
