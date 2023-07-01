
// import { Injectable } from '@angular/core';
// import { Filesystem, Directory } from '@capacitor/filesystem';
// import { Capacitor } from '@capacitor/core';
// import { Photo } from './photo.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class PhotoService {
//   async savePhoto(photo: Photo) {
//     const fileName = new Date().getTime() + '.jpeg';

//     let savedFile;
//     if (Capacitor.getPlatform() === 'web') {
//       savedFile = await Filesystem.writeFile({
//         path: fileName,
//         data: photo.webPath,
//         directory: Directory.Data
//       });
//     } else {
//       const base64Data = await this.readAsBase64(photo);
//       savedFile = await Filesystem.writeFile({
//         path: fileName,
//         data: base64Data,
//         directory: Directory.Data
//       });
//     }

//     // Handle savedFile
//     console.log('Photo saved:', savedFile.uri);
//   }

//   private async readAsBase64(photo: Photo) {
//     const response = await fetch(photo.webPath);
//     const blob = await response.blob();
//     return await this.convertBlobToBase64(blob);
//   }

//   private convertBlobToBase64(blob: Blob): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onerror = reject;
//       reader.onloadend = () => {
//         if (typeof reader.result === 'string') {
//           resolve(reader.result);
//         } else {
//           reject(new Error('Failed to convert blob to base64'));
//         }
//       };
//       reader.readAsDataURL(blob);
//     });
//   }
// }
