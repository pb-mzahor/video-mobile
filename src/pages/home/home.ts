import {Component} from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {ImagePicker} from '@ionic-native/image-picker';
import {Camera} from '@ionic-native/camera';
import {clamp} from 'ionic-angular/util/util';
import {ViewChild} from '@angular/core';
import {Slides} from 'ionic-angular';
import {CloudinaryService} from '../../services/CloudinaryService';
import {GeneratorService} from "../../services/GeneratorService";
import {PlayPage} from '../play/play';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  playPage = PlayPage;
  public scenes: any[];
  isGenerating: boolean;
  @ViewChild(Slides) slides: Slides;

  constructor(public camera: Camera,
              public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public cloudinaryService: CloudinaryService,
              private generatorService: GeneratorService) {
    this.scenes = [];
    this.isGenerating = false;
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
}
