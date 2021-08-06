import { AuthServiceService } from './../services/auth-service.service';
import { GlobalMethods } from './../services/global';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm:FormGroup

  constructor(private nav:NavController,
              private form:FormBuilder,
              private fbAuth:AngularFireAuth,
              private global:GlobalMethods,
              private authService:AuthServiceService) { }

  ngOnInit() {
    this.signupForm = this.form.group({
      fname: ['', [Validators.required, Validators.maxLength(7)]],
      lname: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    })
  }
  back(){
    this.nav.navigateBack(['/login'])
  }

  signup(){
    if (this.signupForm.value.password != this.signupForm.value.confirmPassword) {
      this.global.CreateToast(`La contraseña debe coincidir!`)
    }else{
      this.global.presentLoading(`Por favor espere!`)
      this.authService.registerUser(this.signupForm.value).then(() =>{
        this.global.hideLoading()
        this.global.presentLoading(`Logging in`)
        this.authService.loginUser(this.signupForm.value).then(() =>{
          this.global.hideLoading()
          this.nav.navigateForward(['/login'])
        }).catch(err =>{
          console.log(JSON.stringify(err))
          this.nav.navigateForward(['/login'])
          this.global.timeoutHide(1000)
        })
      }).catch(err =>{
        console.log(JSON.stringify(err))
        this.global.timeoutHide(1000)
      })
    }
  }
}
