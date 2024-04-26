import { Routes } from '@angular/router';
import { PGPValidationComponent } from './pgp-validation/pgp-validation.component';
import { PGPSignatureComponent } from './pgp-signature/pgp-signature.component';
import { PGPPublicKeyExtractorComponent } from './pgppublic-key-extractor/pgp-public-key-extractor.component';

export enum RoutesEnum {
    SIGN = 'sign',
    VERIFY = 'verify',
    PUB_KEY_EXTRACTOR = 'pub-key-extractor'
}

export const routes: Routes = [
    {
        path: RoutesEnum.VERIFY,
        component: PGPValidationComponent
    },
    {
        path: RoutesEnum.SIGN,
        component: PGPSignatureComponent
    },
    {
        path: RoutesEnum.PUB_KEY_EXTRACTOR,
        component: PGPPublicKeyExtractorComponent
    },
    {
        path: '',
        redirectTo: RoutesEnum.SIGN,
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: RoutesEnum.SIGN
    }
];
