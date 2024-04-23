import { Component } from '@angular/core';
import * as openpgp from 'openpgp';

@Component({
  selector: 'app-pgp-signature',
  template: `
    <div>
      <p>Select Private Key: </p><input type="file" (change)="onPrivateKeySelected($event)" placeholder="Select Private Key">
      <p>Select Document: </p><input type="file" (change)="onDataFileSelected($event)" placeholder="Select Data File">
      <button (click)="generateSignature()" [disabled]="this.selectedDataFile == null && this.selectedPrivateKey == null">Generate Signature</button>
    </div>
  `,
  styles: `
    p {
      margin: 0;
    }
    input {
      display: block;
      margin-bottom: 15px;
    }
    button {
      margin-top: 10px;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  `
})
export class PgpSignatureComponent {
  selectedPrivateKey: File | null = null;
  selectedDataFile: File | null = null;
  detachedSignatureFile: File | null = null;

  onPrivateKeySelected(event: any) {
    this.selectedPrivateKey = event.target.files[0];
  }

  onDataFileSelected(event: any) {
    this.selectedDataFile = event.target.files[0];
  }

  onFileSelected(event: any) {
    this.selectedPrivateKey = event.target.files[0];
  }

  async generateSignature() {
    if (!this.selectedPrivateKey || !this.selectedDataFile) {
      console.error('No private key or data file selected');
      return;
    }

    const privateKeyReader = new FileReader();
    const dataFileReader = new FileReader();

    privateKeyReader.onload = async () => {
      const privateKeyPem = privateKeyReader.result as string;

      dataFileReader.onload = async () => {
        const arrayBuffer = dataFileReader.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);

        this.saveSignature(await this.sign(byteArray, privateKeyPem, 'Ai5!hM#c'));
      };

      dataFileReader.readAsArrayBuffer(this.selectedDataFile as Blob);
    };

    privateKeyReader.readAsText(this.selectedPrivateKey);
  }

  async sign(data: Uint8Array, privateKeyPem: string, passphrase: string): Promise<string> {
    const privKeyObj = await openpgp.readPrivateKey({ armoredKey: privateKeyPem });
    const privateKey = await openpgp.decryptKey({ privateKey: privKeyObj, passphrase: passphrase });
    const message = await openpgp.createMessage({ binary: data, format: 'binary' });
    const detachedSignature = await openpgp.sign({
        message,
        signingKeys: privateKey,
        detached: true,
        format: 'armored'
    });
    console.log(detachedSignature);

    return detachedSignature;
  }

  saveSignature(signature: string) {
    const blob = new Blob([signature], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = 'signature.sig';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
  }
}
