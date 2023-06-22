import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imageSource: string | undefined;

  constructor(private photoService: PhotoService) {}

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });
    this.imageSource = image.webPath;

    // this.photoService.savePhoto(image);
  }
}
