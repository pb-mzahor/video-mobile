import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { clamp } from 'ionic-angular/util/util';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { CloudinaryService } from '../../services/CloudinaryService';
import { PlayPage } from '../play/play';
import { VideoSpecService } from '../../services/VideoSpecService';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  playPage = PlayPage;
  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    public camera: Camera,
    public cloudinaryService: CloudinaryService,
    public videoSpecService: VideoSpecService,
  ) {
    this.videoSpecService.scenes.push({});
  }

  async addScene() {
    this.videoSpecService.scenes.push({});
    setTimeout(() => this.slides.slideTo(this.slides.length() - 1, 500), 100);
  }

  removeImage(scene) {
    delete scene.base64Image;
    delete scene.imageUrl;
    delete scene.imageUrlStyle;
  }

  async addImage(scene) {
    scene.loading = true;

    try {
      const imageData = await this.camera.getPicture({
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        destinationType: this.camera.DestinationType.DATA_URL
      });

      scene.base64Image = `data:image/jpeg;base64,${imageData}`;
      delete scene.imageUrlStyle;
      scene.imageUrl = await this.cloudinaryService.uploadBase64Image(scene.base64Image);
      scene.imageUrlStyle = `url(${scene.imageUrl})`;
    } catch (error) {
      console.error(error);
    }

    scene.loading = false;
  }

  async juggle() {
    const spec = this.videoSpecService.buildVideoSpec();
    console.log(spec);
    this.navCtrl.push(PlayPage);
  }
}
