import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  imageSources: string[] = []; // Liste pour stocker les URL des images

  constructor() { }

  // Fonction pour prendre une photo
  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    const imageDataUrl = this.getImageDataUrl(image.base64String); // Convertir la base64 en URL de données
    this.imageSources.push(imageDataUrl); // Ajouter l'URL de l'image à la liste
    await this.storeImageInIndexedDB(image.base64String); // Stocker l'image dans IndexedDB
  }

  // Convertir la base64 en URL de données
  getImageDataUrl(base64String: string | undefined): string {
    return 'data:image/jpeg;base64,' + base64String; // Convertir la base64 en URL de données
  }

  // Stocker l'image dans IndexedDB
  async storeImageInIndexedDB(imageData: string | undefined) {
    const imageDataObj = { imageData, timestamp: new Date().getTime() }; // Créer un objet avec les données de l'image et le timestamp

    try {
      const db = await this.openDatabase(); // Ouvrir la base de données IndexedDB
      const transaction = db.transaction('images', 'readwrite'); // Créer une transaction en mode lecture/écriture
      const objectStore = transaction.objectStore('images'); // Récupérer l'object store pour les images
      const addRequest = objectStore.add(imageDataObj); // Ajouter l'objet dans l'object store

      addRequest.onsuccess = () => {
        console.log('Image stored successfully'); // Lorsque l'ajout est terminé avec succès
      };

      addRequest.onerror = () => {
        console.error('Error storing image'); // Lorsqu'il y a une erreur lors de l'ajout
      };
    } catch (error) {
      console.error('Failed to open database', error); // Lorsqu'il y a une erreur lors de l'ouverture de la base de données
    }
  }

  // Ouvrir la base de données IndexedDB
  openDatabase(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('imageDatabase', 1); // Ouvrir la base de données avec le nom et la version

      request.onupgradeneeded = (event: any) => {
        const db: IDBDatabase = event.target.result;
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id', autoIncrement: true }); // Créer l'object store si nécessaire
        }
      };

      request.onsuccess = (event: any) => {
        const db: IDBDatabase = event.target.result;
        resolve(db); // Résolution de la promesse avec la base de données ouverte
      };

      request.onerror = (event: any) => {
        reject(event.target.error); // Rejet de la promesse avec l'erreur
      };
    });
  }
}