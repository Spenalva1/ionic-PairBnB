import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePicked = new EventEmitter<string>();

  selectedImage: string;

  constructor() { }

  ngOnInit() {}

  async onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    try {
      const image = await Plugins.Camera.getPhoto({
        quality: 50,
        source: CameraSource.Prompt,
        correctOrientation: true,
        height: 320,
        width: 200,
        resultType: CameraResultType.Base64
      });
      this.selectedImage = image.base64String;
      this.imagePicked.emit(this.selectedImage);
    } catch (error) {
      console.log('Error -> ', error);
      return;
    }
  }
}
