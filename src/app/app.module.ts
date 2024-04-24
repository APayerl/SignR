import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PGPSignatureComponent } from './pgp-signature/pgp-signature.component';
import { RouterOutlet } from '@angular/router';
import { PGPValidationComponent } from './pgp-validation/pgp-validation.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PGPPublicKeyCombinerComponent } from './pgp-public-key-combiner/pgp-public-key-combiner.component';

@NgModule({
  declarations: [
    AppComponent,
    PGPSignatureComponent,
    PGPValidationComponent,
    PGPPublicKeyCombinerComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }