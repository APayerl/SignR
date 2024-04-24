import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PGPValidationComponent } from './pgp-validation.component';

describe('PGPValidationComponent', () => {
  let component: PGPValidationComponent;
  let fixture: ComponentFixture<PGPValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PGPValidationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PGPValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
