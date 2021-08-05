import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NavigationExtras, Router } from '@angular/router';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { AuthServiceService } from '../services/auth-service.service';
import { GlobalMethods } from '../services/global';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-makeareview',
  templateUrl: './makeareview.page.html',
  styleUrls: ['./makeareview.page.scss'],
})
export class MakeareviewPage implements OnInit {
  data: any = {}
  title: string
  reviews: Array<any> = []
  state:boolean = false
  constructor(private router: Router,
    private db: AngularFireDatabase,
    private authService: AuthServiceService,
    private global: GlobalMethods,
    private location: Location,
    private screenshot:Screenshot,
    private socialSharing:SocialSharing,
    private nav:NavController
  ) { }

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state.data
    this.title = this.router.getCurrentNavigation().extras.state.title
    // this.reviews = this.data.reviews
  }
  back1(){
    this.nav.navigateBack(['/directory'])
  }
  

  ionViewWillEnter() {
   this.db.list(`reviews/${this.data.id}`).valueChanges().subscribe(res =>{
     console.log(JSON.stringify(res))
     this.reviews = res
   })
  }
  back() {
    this.location.back()
  }
  makeReview() {
    let navigationExtras: NavigationExtras = { state: { data: this.data } };
    this.router.navigate(['/make-review', { Animation: true }], navigationExtras);
  }
  onModelChange(evt){

  }

  reset() {
    var self = this;
    setTimeout(function () {
      self.state = false;
    }, 5000);
  }
 
  screenShotURI() {

    this.screenshot.URI(80).then(res => {
      this.state = true;
      this.socialSharing.share(null, null, res.URI, null).then(() => {
        this.global.CreateToast('Screenshot shared');
      }).catch(error => {
        this.global.CreateToast(error);
      })
      this.reset();
    }).catch(error =>{
      this.global.CreateToast(error);
    })
  }
  
}
