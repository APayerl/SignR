import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PGPSignatureComponent } from './pgp-signature/pgp-signature.component';
import { RouterModule } from '@angular/router';
import { PGPValidationComponent } from './pgp-validation/pgp-validation.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { routes } from './app.routes';
import { PGPPublicKeyExtractorComponent } from './pgppublic-key-extractor/pgp-public-key-extractor.component';

@NgModule({
  declarations: [
    AppComponent,
    PGPSignatureComponent,
    PGPValidationComponent,
    PGPPublicKeyExtractorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }