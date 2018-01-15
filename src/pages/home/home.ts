import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { clamp } from 'ionic-angular/util/util';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public scenes: any[];
  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    public camera: Camera,
  ) {
    this.scenes = [];
    this.scenes.push({});
  }

  async addScene() {
    this.scenes.push({});
    setTimeout(() => this.slides.slideTo(this.slides.length() - 1, 500), 100);
  }

  async addImage(scene) {
    const imageData = await this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
    });

    const base64Image = `data:image/jpeg;base64,${imageData}`;

    scene.base64Image = base64Image;
  }
}
