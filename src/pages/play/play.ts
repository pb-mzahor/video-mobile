import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NavController, LoadingController, NavParams} from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {
  video: any;
  state: any;
  videosYouCanCrosspostURL: any;
  constructor(private http: HttpClient, private params: NavParams) {
    this.video = params.get('videoObj');
    this.state = 'DEFAULT';
    console.log(this.video);
  }

  async saveVideo() {
  }

  async crosspost() {
    this.state = 'UPLOADING';
    //let videoUrl = 'http://img.playbuzz.com/video/upload/w_200,h_720,g_center,c_crop/up0szhaqpakhv4dnzpkz.mp4';
    const url = `https://stg-video-creator.playbuzz.com/mobile/crossPostVideo`;

    var request = {videoUrl: this.video.mp4.src,
      facebookPageUrl:"https://www.facebook.com/yosefKaro7TLV",
      sectionId:"79084e72-1125-4d37-a6a9-62837ca660f9",
      itemId:"12277a5f-d3e7-4c3e-8614-a13a23c3f0c4"};
    try {
      var response: any = await this.http.post(url, request).toPromise();
      this.videosYouCanCrosspostURL = response.videosYouCanCrosspostURL;
      this.state = 'UPLOAD_COMPLETE';
    } catch (error) {
      console.error(error);
    }
  }
}
