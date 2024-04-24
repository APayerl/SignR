import { Component } from '@angular/core';
import * as openpgp from 'openpgp';
import { saveToFile } from '../utils/FileUtils';

@Component({
  selector: 'app-pgp-public-key-combiner',
  standalone: false,
  template: `
    <div>
      <p>Select PGP Public keys to combine</p>
      <input type="file" multiple="multiple" (change)="handleFileInput($event)">
      <button (click)="saveKeyToFile(combinePublicKeys(this.selectedFiles))">Combine Public Keys</button>
    </div>
  `,
  styles: `
    input {
      display: block;
      margin-bottom: 15px;
    }

    button {
      margin-top: 10px;
    }
  `
})
export class PGPPublicKeyCombinerComponent {
  selectedFiles: File[] = [];
  saveKeyToFile = async (key: Promise<openpgp.PublicKey>) => {
    const publicKey = await key;
    saveToFile(publicKey.armor(), 'combined-public-key.asc').click();
  };

  handleFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.selectedFiles = inputElement.files ? Array.from(inputElement.files) : [];
  }

  async combinePublicKeys(keysToAdd: File[]): Promise<openpgp.PublicKey> {
    if (keysToAdd.length >= 2) {
      const key: openpgp.PublicKey = await keysToAdd
        .map(async file => file.text())
        .map(async armor => openpgp.readKey({ armoredKey: await armor }))
        .reduce(async (prev, key) => {
          let previous = await prev;
          previous.subkeys.push(...(await key).subkeys);
          return previous;
        });

      return key;
    } else {
      const errorMessage = 'Please select at least two public keys';
      throw new Error(errorMessage);
    }
  }
}
