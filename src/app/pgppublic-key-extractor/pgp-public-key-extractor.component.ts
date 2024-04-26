import { Component } from '@angular/core';

import * as openpgp from 'openpgp';
import { saveToFile } from '../utils/FileUtils';

@Component({
  selector: 'app-pgp-public-key-extractor',
  standalone: false,
  templateUrl: './pgp-public-key-extractor.component.html',
  styleUrl: './pgp-public-key-extractor.component.scss'
})
export class PGPPublicKeyExtractorComponent {
  selectedPrivateKey: File | null = null;

  onPrivateKeySelected(event: any) {
    this.selectedPrivateKey = event.target.files[0];
  }

  savePublicKey = (publicKey: openpgp.PublicKey): void => {
    if(!publicKey) throw new Error('No public key to save');
    saveToFile(publicKey.armor(), `${this.selectedPrivateKey?.name.replace(/\.asc$/, '')}.pub`).click();
  }

  async extractPublicKey() {
    if (!this.selectedPrivateKey) {
      console.debug('No private key file selected');
      return;
    }

    const privateKeyContent: string = await this.selectedPrivateKey.text();
    const privateKey: openpgp.PrivateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyContent });
    this.savePublicKey(privateKey.toPublic());
  }
}
