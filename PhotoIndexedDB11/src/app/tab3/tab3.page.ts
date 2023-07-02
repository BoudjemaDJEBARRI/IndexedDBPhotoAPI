import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  imageSources: string[] = [];

  constructor() {
    this.loadImages();
  }

  async loadImages() {
    try {
      // Charger les images depuis IndexedDB
      const images = await this.getImagesFromIndexedDB();
      this.imageSources = images || []; // Assigner les images chargées au tableau imageSources
    } catch (error) {
      console.error('Failed to load images', error);
    }
  }

  async getImagesFromIndexedDB(): Promise<string[] | null> {
    return new Promise<string[] | null>((resolve, reject) => {
      // Ouvrir la base de données IndexedDB
      const request = indexedDB.open('imageDatabase', 1);

      request.onsuccess = (event: any) => {
        const db: IDBDatabase = event.target.result;

        // Démarrer une transaction en lecture seule
        const transaction = db.transaction('images', 'readonly');

        // Obtenir l'object store pour les images
        const objectStore = transaction.objectStore('images');

        // Récupérer toutes les images de l'object store
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
          // Convertir les données base64 en URL de données pour chaque image
          const images = getAllRequest.result.map((item: any) => {
            const imageDataUrl = this.getImageDataUrl(item.imageData);
            return imageDataUrl;
          });

          resolve(images); // Renvoyer les images chargées
        };

        getAllRequest.onerror = () => {
          reject(getAllRequest.error);
        };
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }

  getImageDataUrl(base64String: string): string {
    return 'data:image/jpeg;base64,' + base64String;
  }
}
