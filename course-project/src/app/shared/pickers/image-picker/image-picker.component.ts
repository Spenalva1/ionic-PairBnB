import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;
  @Output() imagePicked = new EventEmitter<string | File>();
  @Input() showPreview = false;

  selectedImage: string;
  usePicker = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    if ((!this.platform.is('hybrid') && this.platform.is('mobile')) || this.platform.is('desktop')){
      this.usePicker = true;
    }
  }

  async onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    try {
      const image = await Plugins.Camera.getPhoto({
        quality: 50,
        source: CameraSource.Prompt,
        correctOrientation: true,
        width: 600,
        resultType: CameraResultType.Base64
      });
      this.selectedImage = 'data:image/jpeg;base64,' + image.base64String;
      this.imagePicked.emit(image.base64String);
    } catch (error) {
      if (this.usePicker){
        this.filePicker.nativeElement.click();
      }
      console.log('Error -> ', error);
      return;
    }
  }

  onFilePicked(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePicked.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}
