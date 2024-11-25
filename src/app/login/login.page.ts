import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private navCtrl: NavController,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    // Inicializa el formulario en ngOnInit
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.http.post('http://127.0.0.1:8000/api/login', loginData, { withCredentials: true }).subscribe({
        next: (response: any) => {
          console.log('Login exitoso:', response);

          // Guardar los datos del usuario en el servicio de sesión
          this.sessionService.setUserData(response);

          // Navegar al home
          this.navCtrl.navigateRoot('/home');
        },
        error: (err) => {
          console.error('Error en el login:', err);
          alert('Credenciales inválidas. Por favor, verifica tus datos.');
        },
      });
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}
