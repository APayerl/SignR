import { Component, NgModule } from '@angular/core';
import * as openpgp from 'openpgp';

@Component({
  selector: 'app-pgp-signature',
  template: `
    <div>
      <p>Select Private Key: </p><input type="file" (change)="onPrivateKeySelected($event)" placeholder="Select Private Key">
      <input type="password" placeholder="Enter Private Key Password" [(ngModel)]="this.passphrase">
      <p>Select Document: </p><input type="file" (change)="onDataFileSelected($event)" placeholder="Select Data File">
      <p>Signature Document: </p><input type="file" (change)="onSignatureFileSelected($event)" placeholder="Select Signature File">
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

    this.saveSignature(await this.sign(byteArray, privateKeyPem, this.passphrase, signatures));
    this.passphrase = '';

    // const privateKeyReader = new FileReader();
    // const dataFileReader = new FileReader();

    // privateKeyReader.onload = async () => {
    //   const privateKeyPem = privateKeyReader.result as string;

    //   dataFileReader.onload = async () => {
    //     const arrayBuffer = dataFileReader.result as ArrayBuffer;
    //     const byteArray = new Uint8Array(arrayBuffer);

    //     this.saveSignature(await this.sign(byteArray, privateKeyPem, 'Ai5!hM#c'));
    //   };

    //   dataFileReader.readAsArrayBuffer(this.selectedDataFile as Blob);
    // };

    // privateKeyReader.readAsText(this.selectedPrivateKey);
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

  saveSignature(signature: string) {
    const blob = new Blob([signature], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = 'signature.sig';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
  }
}
