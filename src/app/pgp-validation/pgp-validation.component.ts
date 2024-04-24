import { Component } from '@angular/core';
import * as openpgp from 'openpgp';

@Component({
  selector: 'app-pgp-validation',
  standalone: false,
  template: `
  <div>
      <p>Select Document: </p><input type="file" (change)="onDataFileSelected($event)" placeholder="Select Data File">
      <p>Select Signature file: </p><input type="file" (change)="onSignatureFileSelected($event)" placeholder="Select Signature file">
      <p>Select Public Key files: </p><input type="file" multiple (change)="onPublicKeyFileSelected($event)" placeholder="Select Public Key file">
      <button (click)="validateSignature()" [disabled]="this.selectedDataFile == null && this.signatureFile == null && this.selectedPublicKeyFiles.length == 0">Validate Signature</button>
    </div>
  `,
  styleUrl: './pgp-validation.component.scss'
})
export class PGPValidationComponent {
  selectedDataFile: File | null = null;
  selectedPublicKeyFiles: File[] = [];
  signatureFile: File | null = null;

  onDataFileSelected(event: any) {
    this.selectedDataFile = event.target.files[0];
  }

  onPublicKeyFileSelected(event: any) {
    console.info(typeof(this.selectedPublicKeyFiles))
    console.info(typeof(event.target.files))
    this.selectedPublicKeyFiles = Array.from(event.target.files);
  }

  onSignatureFileSelected(event: any) {
    this.signatureFile = event.target.files[0];
  }

  async validateSignature() {
    if (!this.selectedDataFile || !this.signatureFile || this.selectedPublicKeyFiles.length == 0) {
      console.error('No data file, signature file or public key file selected');
      return;
    }

    const dataFileContent: string = await this.selectedDataFile.text();
    const signatureFileContent: string = await this.signatureFile.text();
    const publicKeyFileContent: Promise<string>[] = this.selectedPublicKeyFiles.map(file => file.text());

    const publicKeys: openpgp.Key[] = await Promise.all(publicKeyFileContent.map(async key => openpgp.readKey({ armoredKey: await key })));

    const verified = await openpgp.verify({
      message: await openpgp.createMessage({ text: dataFileContent }),
      signature: await openpgp.readSignature({ armoredSignature: signatureFileContent }),
      verificationKeys: publicKeys
    });

    verified.signatures.forEach(async (signature) => {
      try {
        const KeyMapping = (key: openpgp.Key) => ({
          keyID: key.getKeyIDs()[0],
          userID: key.getUserIDs()[0]
        });
        await signature.verified;
        const signer = publicKeys
          .map(key => KeyMapping(key))
          .find(keyMapping => keyMapping.keyID.bytes === signature.keyID.bytes);
        console.debug("Signature verified by key id: ", signer?.userID);
      } catch(err) {
        console.error('Signature is invalid: ', err);
      }
    });
  }
}
