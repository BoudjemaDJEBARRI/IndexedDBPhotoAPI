import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  imageSources: string[] = [];

  constructor() { }

  async takePhoto() {
    // Utiliser la fonction `getPhoto` du plugin Capacitor Camera pour prendre une photo
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    // Convertir la chaîne Base64 de l'image en URL de données
    const imageDataUrl = this.getImageDataUrl(image.base64String);

    // Ajouter l'URL de données de l'image à la liste des sources d'images
    this.imageSources.push(imageDataUrl);

    // Stocker l'image dans IndexedDB
    await this.storeImageInIndexedDB(image.base64String);
  }

  getImageDataUrl(base64String: string | undefined): string {
    // Générer l'URL de données en utilisant la chaîne Base64 de l'image
    return 'data:image/jpeg;base64,' + base64String;
  }

  async storeImageInIndexedDB(imageData: string | undefined) {
    // Créer un objet contenant les données de l'image et le timestamp
    const imageDataObj = { imageData, timestamp: new Date().getTime() };

    try {
      // Ouvrir la base de données IndexedDB
      const db = await this.openDatabase();

      // Démarrer une transaction en écriture
      const transaction = db.transaction('images', 'readwrite');

      // Obtenir l'object store pour les images
      const objectStore = transaction.objectStore('images');

      // Ajouter l'objet d'image à l'object store
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
      // Ouvrir la base de données IndexedDB avec le nom et la version spécifiés
      const request = indexedDB.open('imageDatabase', 1);

      // Gérer l'événement onupgradeneeded lors de la mise à niveau de la base de données
      request.onupgradeneeded = (event: any) => {
        const db: IDBDatabase = event.target.result;

        // Vérifier si l'object store pour les images n'existe pas déjà
        if (!db.objectStoreNames.contains('images')) {
          // Créer un nouvel object store pour les images avec une clé automatique
          db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
        }
      };

      // Gérer l'événement onsuccess lorsque la base de données est ouverte avec succès
      request.onsuccess = (event: any) => {
        const db: IDBDatabase = event.target.result;
        resolve(db); // Renvoyer la base de données ouverte
      };

      // Gérer l'événement onerror en cas d'erreur lors de l'ouverture de la base de données
      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }

}
