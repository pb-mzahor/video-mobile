import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { clamp } from 'ionic-angular/util/util';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { CloudinaryService } from '../../services/CloudinaryService';
import { PlayPage } from '../play/play';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  playPage = PlayPage;
  public scenes: any[];
  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    public camera: Camera,
    public cloudinaryService: CloudinaryService,
  ) {
    this.scenes = [];
    this.scenes.push({});
  }

  async addScene() {
    this.scenes.push({});
    setTimeout(() => this.slides.slideTo(this.slides.length() - 1, 500), 100);
  }

  noop($event) {
    $event.stopPropagation();
  }

  async addImage(scene) {
    scene.loading = true;

    try {
      const imageData = await this.camera.getPicture({
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        destinationType: this.camera.DestinationType.DATA_URL
      });

      scene.base64Image = `data:image/jpeg;base64,${imageData}`;
      scene.imageUrl = await this.cloudinaryService.uploadBase64Image(scene.base64Image);
      scene.imageUrlStyle = `url(${scene.imageUrl})`;
    } catch (error) {
      console.error(error);
    }
    
    scene.loading = false;
  }
}
