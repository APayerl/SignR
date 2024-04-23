import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgpSignatureComponent } from './pgp-signature.component';

describe('PgpSignatureComponent', () => {
  let component: PgpSignatureComponent;
  let fixture: ComponentFixture<PgpSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgpSignatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PgpSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
