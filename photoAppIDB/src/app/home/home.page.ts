// import { Component } from '@angular/core';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// // import { PhotoService } from '../photo.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: 'home.page.html',
//   styleUrls: ['home.page.scss'],
// })
// export class HomePage {
//   // imageSource: string | undefined;
//   imageSource : any;
//   storageData: { key: string; value: any }[] = [];
//   constructor() {}

//   // constructor(private photoService: PhotoService) {}

//   async takePhoto() {
//     const image = await Camera.getPhoto({
//       quality: 100,
//       allowEditing: true,
//       resultType: CameraResultType.Uri,
//       source: CameraSource.Prompt
//     });
//     this.imageSource = image.webPath;
//     this.storeData();
//   }

//   async storeData() {
//     await localStorage.setItem('Prénom', 'Elon');
//     await localStorage.setItem('Nom', 'Musk');
//     await localStorage.setItem('Ville', 'Los Angeles');
//     await localStorage.setItem('Age', '25');
//     await localStorage.setItem('Tel', '010203040506');

//     this.getData();
//   }
//   async getData() {
//     const keys = ['Prénom', 'Nom', 'Ville', 'Age', 'Tel'];
//     this.storageData = [];
//     for (const key of keys) {
//       const value = await localStorage.getItem(key);
//       if (value) {
//         this.storageData.push({ key, value });
//       }
//     }
//   }

// }

import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imageSource: string | undefined;
  storageData: { key: string; value: any }[] = [];

  constructor() {}

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });
    this.imageSource = image.webPath;
    this.storeData();
  }

  async storeData() {
    const db = await this.openDatabase();
    if (db) {
      const transaction = db.transaction('myData', 'readwrite');
      const objectStore = transaction.objectStore('myData');

      await this.putItem(objectStore, 'Prénom', 'Elon');
      await this.putItem(objectStore, 'Nom', 'Musk');
      await this.putItem(objectStore, 'Ville', 'Los Angeles');
      await this.putItem(objectStore, 'Age', '25');
      await this.putItem(objectStore, 'Tel', '010203040506');

      this.getData();
    }
  }

  async getData() {
    const db = await this.openDatabase();
    if (db) {
      const transaction = db.transaction('myData', 'readonly');
      const objectStore = transaction.objectStore('myData');

      const keys = ['Prénom', 'Nom', 'Ville', 'Age', 'Tel'];
      this.storageData = [];

      for (const key of keys) {
        const request = objectStore.get(key);
        request.onsuccess = (event) => {
          const value = event.target.result;
          if (value) {
            this.storageData.push({ key, value });
          }
        };
      }
    }
  }

  openDatabase(): Promise<IDBDatabase | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('myDB', 1);

      request.onupgradeneeded = (event) => {
        const db: IDBDatabase = event.target.result;
        db.createObjectStore('myData');
      };

      request.onsuccess = (event) => {
        const db: IDBDatabase = event.target.result;
        resolve(db);
      };

      request.onerror = () => {
        reject(null);
      };
    });
  }

  putItem(objectStore: IDBObjectStore, key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = objectStore.put(value, key);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject();
      };
    });
  }
}
