import { Component } from '@angular/core';
import * as openpgp from 'openpgp';

@Component({
  selector: 'app-pgp-validation',
  standalone: false,
  templateUrl: './pgp-validation.component.html',
  styleUrl: './pgp-validation.component.scss'
})
export class PGPValidationComponent {
  selectedDataFile: File | null = null;
  selectedPublicKeyFiles: File[] = [];
  signatureFile: File | null = null;
  validationConfirmations: string[] = [];
  validationFailures: string[] = [];

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
      this.validationFailures = ["No data file, signature file or public key file selected"];
      console.debug('No data file, signature file or public key file selected');
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

    this.validationConfirmations = [];
    this.validationFailures = [];
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
        this.validationConfirmations.push(signer!.userID);
      } catch(err) {
        this.validationFailures.push("Signature not valid.");
        console.debug('Signature is invalid: ', err);
      }
    });
  }
}
