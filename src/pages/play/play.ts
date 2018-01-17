import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  constructor(private http: HttpClient) { }


  async saveVideo() {
  }

  async crosspost() {
    let videoUrl = 'http://img.playbuzz.com/video/upload/w_200,h_720,g_center,c_crop/up0szhaqpakhv4dnzpkz.mp4';
    const url = `https://stg-video-creator.playbuzz.com/mobile/crossPostVideo`;

    var request = {videoUrl: videoUrl,
      facebookPageUrl:"https://www.facebook.com/yosefKaro7TLV",
      sectionId:"79084e72-1125-4d37-a6a9-62837ca660f9",
      itemId:"12277a5f-d3e7-4c3e-8614-a13a23c3f0c4"};

    const response: any = await this.http.post(url, request).toPromise();

    return response.secure_url;
  }
}
