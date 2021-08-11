import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController, NavController } from '@ionic/angular';
import { DatabaseService } from './database.service';
import { GlobalMethods } from './global';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(
    private afAuth: AngularFireAuth,
    private global:GlobalMethods,
    private database : DatabaseService,
    private alertCtrl:AlertController,
    private nav:NavController,
    private db:AngularFireDatabase
  ) { }


  registerUser(value) {
    return new Promise<any>((resolve, reject) => {

      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            resolve(res)
            value.uid = res.user.uid
            this.database.updateUser(value)
            this.global.CreateToast(`Account has been created!`)
          }
        ).catch((err) => {
          this.global.CreateToast(err.message)
          reject(err)
        })
    })

  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            resolve(res)
            this.global.CreateToast(`Usuario conectado!`)
          }
        ).catch((err) => {
          reject(err)
          this.global.CreateToast(err.message)
        })
    })
  }

  logoutUser() {
    return new Promise<void>((resolve, reject) => {
      from(this.global.presentLoading('Logging out')).subscribe(() =>{
        if (this.afAuth.currentUser) {
          this.afAuth.signOut()
            .then(() => {
              console.log("LOG Out");
              this.nav.navigateRoot(['/login'])
              resolve();
            }).catch((error) => {
              this.global.timeoutHide(1000)
              reject(error);
            });
        }
      }).add(() =>{this.global.hideLoading()})
      
    })
  }

  userId() {
    return this.afAuth.user
  }

 
 getUser(user):Observable<any>{
    return this.db.object(`users/${user.uid}`).valueChanges()
  }

  async forgot() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      cssClass: 'my-custom-alert',
      message: '<img class="img" src="../../assets/images/sad.png" alt="alert" /><br />'
        + '<ion-label class="label-large"> Olvidó su contraseña?</ion-label><br /><ion-label class="label-small">No importa</ion-label>' +
        '',
      inputs: [
        {
          cssClass: 'alert-input',
          name: 'email',
          type: 'email',
          placeholder: 'Escriba su correo electrónico aquí',
          
        },

      ],
      buttons: [
        {
          cssClass: 'alert-button-send',
          text: 'Enviar correo de recuperación',
          handler: data => {
            this.afAuth.sendPasswordResetEmail(data.email).then(() =>{
              this.global.CreateToast('Check your email!')
            }).catch(err =>{
              console.log('Recovery email not sent: '+err);
              this.global.CreateToast(err.message);
            })
          }
        }, {
          text: 'Cancelar',
          role: 'Cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Cancel');
          }
        }
      ]
    });

    await alert.present();
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
 }
 
 async checkUser() {
    const user = await this.isLoggedIn()
    if (user) {
      // do something
      console.log(`User Already LoggedIn`)
      this.nav.navigateForward(['/directory']);
        
    } else {
      // do something else
      console.log(`User not LoggedIn`)
      this.nav.navigateRoot(['/login']);
   }
 }
}
