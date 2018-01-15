import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { clamp } from 'ionic-angular/util/util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public pictures: string;
  public pictureSrc: string;
  public bgImage: string;
  public base64Image: any;

  constructor(
    public navCtrl: NavController,
    public camera: Camera,
  ) {
    this.pictureSrc = 'https://facebook.github.io/react-native/img/header_logo.png';
    this.bgImage = `url('${this.pictureSrc}');`;
  }

  async click() {
    const imageData = await this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
    });

    this.base64Image = 'data:image/jpeg;base64,' + imageData;
  }
}
