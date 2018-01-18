import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { clamp } from 'ionic-angular/util/util';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { CloudinaryService } from '../../services/CloudinaryService';
import { PlayPage } from '../play/play';
import { VideoSpecService } from '../../services/VideoSpecService';
import { GeneratorService } from "../../services/GeneratorService";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  playPage = PlayPage;
  isGenerating: boolean;
  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public camera: Camera,
    public cloudinaryService: CloudinaryService,
    private generatorService: GeneratorService,
    public videoSpecService: VideoSpecService,
  ) {
    this.isGenerating = false;
    this.videoSpecService.scenes.push({});
  }

  async addScene() {
    this.videoSpecService.addScene();
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
    this.onGenerateClick();
  }

  async onGenerateClick() {
    this.isGenerating = true;
    let loader = this.createLoader();
    loader.present();
    this.generatorService.generateVideo('')
      .subscribe(
      response => {
        this.isGenerating = false;
        loader.dismiss();
        this.navCtrl.push(PlayPage, {
          videoObj: response.temp
        });
      },
      error => {
        loader.dismiss();
        console.log(error);
      });
  }

  createLoader() {
    return this.loadingCtrl.create({
      content: "<video autoplay loop>" +
        "<source src='https://img.playbuzz.com/video/upload/v1516201377/b2obarrvbiepgrsdd0pk.mp4'>" +
        "</video>",
      spinner: 'hide',
      cssClass: 'videoOverlayLoader',
      showBackdrop: false
    });
  }

  isSceneRemovable(scene) {
    return this.videoSpecService.scenes.length > 1;
  }

  removeScene(scene) {
    const idx = this.slides.getActiveIndex();
    this.slides.slideTo(idx === 0 ? 0 : idx - 1);
    this.videoSpecService.removeScene(scene);
  }
}
