import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userData: any = null;

  constructor(private http: HttpClient, private navCtrl: NavController,private sessionService: SessionService) {}

  logout() {
    // Llama al endpoint de logout en el backend
    // Limpiar los datos del usuario
    this.sessionService.clearUserData();

    // Navegar al login
    this.navCtrl.navigateRoot('/login');
  }

  ngOnInit() {
    // Obtener los datos del usuario
    this.userData = this.sessionService.getUserData();
    console.log(this.userData);
  }

}
