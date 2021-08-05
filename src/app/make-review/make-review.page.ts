import { Location } from '@angular/common';
import { GlobalMethods } from './../services/global';
import { AuthServiceService } from './../services/auth-service.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-make-review',
  templateUrl: './make-review.page.html',
  styleUrls: ['./make-review.page.scss'],
})
export class MakeReviewPage implements OnInit {
  data: any = {}
  title: string
  rating: any
  sub: string
  comment: string
  uid: string
  name: string
  constructor(private router: Router,
    private db: AngularFireDatabase,
    private authService: AuthServiceService,
    private global: GlobalMethods,
    private location: Location
  ) { }

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state.data
    this.authService.userId().subscribe(res => {
      this.uid = res.uid
      this.db.object(`users/${res.uid}`).valueChanges().subscribe(res => {
        this.global.userProfile = res
        this.name = res['fname'] + ' ' + res['lname']
      })
      console.log(res.email, this.data)
    })

  }
  back() {
    this.location.back()
  }
  onModelChange(evt) {
    this.rating = evt
    console.log(this.rating)
  }
  onSubmit() {
    if (!this.rating || !this.sub || !this.comment ) {
      this.global.CreateToast(`Escribe algo primero!`)
    }else{
      this.global.presentLoading(`Por favor espere!`)
    this.db.database.ref(`reviews`).child(this.data.id).child(this.uid).update({
      cId: this.data.id,
      rating: this.rating,
      subject: this.sub,
      comment: this.comment,
      name: this.name
    }).then(() => {
      this.global.hideLoading()
      this.global.CreateToast(`Rated successfully!`)
      this.location.back()
      this.db.database.ref(`recentReviews`).child(this.data.id).update(this.data)
      this.db.database.ref(`myReviews`).child(this.uid).child(this.data.id).update({
        cName:this.data.name,
        cId: this.data.id,
        rating: this.rating,
        subject: this.sub,
        comment: this.comment,
        name: this.name
      })
      this.sub = ''
      this.comment = ''
    }).catch(err => {
      console.log(err)
      this.global.timeoutHide(1000)
    })
    }
  }
}
