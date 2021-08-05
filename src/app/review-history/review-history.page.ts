import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Location } from '@angular/common';
import { GlobalMethods } from './../services/global';
import { AuthServiceService } from './../services/auth-service.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-history',
  templateUrl: './review-history.page.html',
  styleUrls: ['./review-history.page.scss'],
})
export class ReviewHistoryPage implements OnInit {
  edit:boolean = false
  itemIndex:number
  rating:any
  comment:string
  sub:string
  state:boolean = false
  _uid:string
  reviews:Array<any> = []
  constructor(private db :AngularFireDatabase,
              private auth:AuthServiceService,
              private global:GlobalMethods,
              private location:Location,
              private socialSharing:SocialSharing,
              private screenshot:Screenshot) { }

  ngOnInit() {
    this.auth.userId().subscribe(user =>{
      this._uid = user.uid
      this.db.list(`myReviews/${user.uid}`).valueChanges().subscribe(res =>{
        this.reviews = res
        console.log(JSON.stringify(res))
      })
    })
  }

  editReview(index){
    this.edit = true
    this.itemIndex = index
  }
  submit(index,data){
    if (this.sub === '' || this.comment === '') {
      this.global.CreateToast(`¡Escriba algo primero!`)
    }else{
      this.onSubmit(index,data)
    }
  }
  onSubmit(index,data) {
    this.global.presentLoading(`Por favor espere!`)
    this.db.database.ref(`reviews`).child(data.cId).child(this._uid).update({
      cName:data.cName,
        cId: data.cId,
        rating: this.rating,
        subject: this.sub,
        comment: this.comment,
        name:data.name
    }).then(() => {
      this.global.hideLoading()
      this.global.CreateToast(`¡Calificado con éxito!`)
      this.db.database.ref(`myReviews`).child(this._uid).child(data.cId).update({
        cName:data.cName,
        cId: data.cId,
        rating: this.rating,
        subject: this.sub,
        comment: this.comment,
        name:data.name
      })
      this.edit = false
    this.itemIndex = index
      this.sub = ''
      this.comment = ''
    }).catch(err => {
      console.log(err)
      this.global.timeoutHide(1000)
    })
  }
  onModelChange(evt){

  }
  back() {
    this.location.back()
  }
  cancel(index){
    this.edit = false
    this.itemIndex = index
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
        // this.global.CreateToast('Screenshot shared');
      }).catch(error => {
        this.global.CreateToast(error);
      })
      this.reset();
    }).catch(error =>{
      this.global.CreateToast(error);
    })
  }
}
