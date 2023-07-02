import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  imageSource: string | undefined; // Variable pour stocker l'URL de l'image

  constructor() { }

  // Fonction pour prendre une photo
  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    this.imageSource = this.getImageDataUrl(image.base64String); // Convertir la base64 en URL de données
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

  /**
  constructor() { }
  imageSource: string | undefined;
  imageDataList: { imageData: string | undefined, timestamp: number }[] = [];

  // Fonction pour prendre une photo
  async takePhoto() {
    // Utiliser la caméra pour capturer une photo
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    // Convertir la base64 en URL de données
    this.imageSource = this.getImageDataUrl(image.base64String);

    // Stocker l'image dans IndexedDB
    await this.storeImageInIndexedDB(image.base64String);
  }

  // Convertir la base64 en URL de données
  getImageDataUrl(base64String: string | undefined): string {
    return 'data:image/jpeg;base64,' + base64String;
  }
  
  // Stocker l'image dans IndexedDB
  async storeImageInIndexedDB(imageData: string | undefined) {
    // Ouvrir la base de données IndexedDB
    const request = indexedDB.open('imageDatabase', 1);

    // Lorsque la base de données est ouverte avec succès
    request.onsuccess = (event: any) => {
      // Récupérer la base de données
      const db: IDBDatabase = event.target.result;

      // Créer une transaction en mode lecture/écriture
      const transaction = db.transaction('images', 'readwrite');

      // Récupérer l'object store pour les images
      const objectStore = transaction.objectStore('images');

      // Créer un objet contenant les données de l'image et le timestamp
      const imageDataObj = { imageData, timestamp: new Date().getTime() };

      // Ajouter l'objet dans l'object store
      const addRequest = objectStore.add(imageDataObj);

      // Lorsque l'ajout est terminé avec succès
      addRequest.onsuccess = () => {
        console.log('Image stored successfully');
      };

      // Lorsqu'il y a une erreur lors de l'ajout
      addRequest.onerror = () => {
        console.error('Error storing image');
      };
    };

    // Lorsqu'il y a une erreur lors de l'ouverture de la base de données
    request.onerror = () => {
      console.error('Failed to open database');
    };
  }
   */
