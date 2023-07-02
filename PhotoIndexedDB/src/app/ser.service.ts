import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class SerService {
  constructor() { }

  async getPhoto(): Promise<{ base64String: string; dataUrl: string }> {
    const image = await this.capturePhoto();

    const dataUrl = this.getImageDataUrl(image.base64String);

    return { base64String: image.base64String, dataUrl };
  }

  async capturePhoto(): Promise<{ base64String: string }> {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    if (!image.base64String) {
      throw new Error('Failed to capture photo. Base64 string is undefined.');
    }

    return { base64String: image.base64String };
  }

  getImageDataUrl(base64String: string): string {
    return 'data:image/jpeg;base64,' + base64String;
  }

  async storeImage(imageData: string): Promise<void> {
    const imageDataObj = { imageData, timestamp: new Date().getTime() };

    try {
      const db = await this.openDatabase();
      const transaction = db.transaction('images', 'readwrite');
      const objectStore = transaction.objectStore('images');
      const addRequest = objectStore.add(imageDataObj);

      addRequest.onsuccess = () => {
        console.log('Image stored successfully');
      };

      addRequest.onerror = () => {
        console.error('Error storing image');
      };
    } catch (error) {
      console.error('Failed to open database', error);
    }
  }

  openDatabase(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('imageDatabase', 2);

      request.onupgradeneeded = (event: any) => {
        const db: IDBDatabase = event.target.result;
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event: any) => {
        const db: IDBDatabase = event.target.result;
        resolve(db);
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }
}