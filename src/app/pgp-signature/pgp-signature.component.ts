import { Component, NgModule } from '@angular/core';

import { saveToFile } from '../utils/FileUtils';

import * as openpgp from 'openpgp';

@Component({
  selector: 'app-pgp-signature',
  templateUrl: './pgp-signature.component.html',
  styleUrls: ['./pgp-signature.component.scss']
})
export class PGPSignatureComponent {
  selectedPrivateKey: File | null = null;
  selectedDataFile: File | null = null;
  detachedSignatureFile: File | null = null;
  passphrase: string = '';

  onPrivateKeySelected(event: any) {
    this.selectedPrivateKey = event.target.files[0];
  }

  onDataFileSelected(event: any) {
    this.selectedDataFile = event.target.files[0];
  }

  onSignatureFileSelected(event: any) {
    this.detachedSignatureFile = event.target.files[0];
  }

  onPassphraseChanged(event: any) {
    this.passphrase = event.target.value;
  }

  async generateSignature() {
    if (!this.selectedPrivateKey || !this.selectedDataFile) {
      console.error('No private key or data file selected');
      return;
    }

    const byteArray = new Uint8Array(await this.selectedDataFile.arrayBuffer());
    const privateKeyPem = await this.selectedPrivateKey.text();
    const signatures = await this.detachedSignatureFile?.text();

    this.saveSignature(await this.sign(byteArray, privateKeyPem, this.passphrase, signatures), this.selectedDataFile.name);
    this.passphrase = '';
  }

  async sign(data: Uint8Array, privateKeyPem: string, passphrase: string, armoredSignatures: string | undefined): Promise<string> {
    const privKeyObj = await openpgp.readPrivateKey({ armoredKey: privateKeyPem });
    const privateKey = await openpgp.decryptKey({ privateKey: privKeyObj, passphrase: passphrase });

    const message = await openpgp.createMessage({ binary: data, format: 'binary' });
    const detachedSignature = await openpgp.sign({
        message,
        signingKeys: privateKey,
        detached: true,
        format: 'armored'
    });
    const detachedSignatureNoArmor = await openpgp.readSignature({ armoredSignature: detachedSignature });
    let armor = detachedSignatureNoArmor.armor();

    if(armoredSignatures) {
      const signatures = await openpgp.readSignature({ armoredSignature: armoredSignatures })
      signatures.packets.push(detachedSignatureNoArmor.packets[0]);
      armor = signatures.armor();
    }

    return armor;
  }

  saveSignature = (signature: string, signedFileName: string) => {
    saveToFile(signature, `${new Date(Date.now()).toISOString()}_${signedFileName}.sig`).click();
  }
}
