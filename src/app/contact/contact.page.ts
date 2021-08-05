import { GlobalMethods } from './../services/global';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  sub:string
  comment:string
  email:Array<string> = ["consumidordominicano@gmail.com"]
  constructor(private socialSharing:SocialSharing,
              private global:GlobalMethods) { }

  ngOnInit() {
  }

  onSubmit(){
    if (!this.sub || !this.comment) {
      this.global.CreateToast(`Escribe algo primero!`)
    }else{
      this.socialSharing.canShareViaEmail().then(() =>{
        this.socialSharing.shareViaEmail(this.comment,this.sub,this.email).then(() =>{
          console.log(`Email enviado`)
        }).catch(err =>{
          this.global.CreateToast(err)
        })
      })
    }
  }

}
