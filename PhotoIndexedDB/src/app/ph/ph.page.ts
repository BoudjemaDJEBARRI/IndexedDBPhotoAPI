import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-ph',
  templateUrl: './ph.page.html',
  styleUrls: ['./ph.page.scss'],
})
export class PhPage implements OnInit {

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

  ngOnInit() {
  }

}
