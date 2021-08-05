import { GlobalMethods } from './services/global';
import { AuthServiceService } from './services/auth-service.service';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/directory', icon: 'home' },
    { title: 'Perfil', url: '/profile', icon: 'person' },
    { title: 'Reseñas Recientes', url: '/recentreviews', icon: 'chatbox-ellipses' },  
    { title: 'Contacto', url: '/contact', icon: 'paper-plane' },
    { title: 'Nosotros', url: '/aboutus', icon: 'information-circle' },
    
  ];
  public dark:boolean = false
  constructor(private plt:Platform,
    private authService:AuthServiceService,
    public global:GlobalMethods) {
    this.plt.ready().then(() =>{
      if (localStorage.getItem('dark') === 'true') {
        this.dark = true
      } else {
        localStorage.setItem('dark', 'false')
        this.dark = false
      }      
      this.authService.checkUser()
    })
   }

   onClick(key){
    switch (key) {
      case 'Logout':
        this.authService.logoutUser()
        break;
    
      default:
        break;
    }
   }
}
