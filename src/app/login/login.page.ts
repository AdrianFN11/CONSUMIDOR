import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthServiceService } from '../services/auth-service.service';
import { GlobalMethods } from '../services/global';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm:FormGroup

  constructor(private nav:NavController,
              private form:FormBuilder,
              private fbAuth:AngularFireAuth,
              private global:GlobalMethods,
              private authService:AuthServiceService) { }

  ngOnInit() {
    this.loginForm = this.form.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }
  login(){
    this.global.presentLoading(`Iniciando sesión `)
    this.authService.loginUser(this.loginForm.value).then(() =>{
      this.global.hideLoading()
      this.nav.navigateForward(['/directory'])
    }).catch(err =>{
      console.log(JSON.stringify(err))
      this.global.timeoutHide(1000)
    })
  }

  loginWithGoogle(){

  }

  forgotPassword(){
    this.authService.forgot()
  }
  
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
 

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
} 

 
}
