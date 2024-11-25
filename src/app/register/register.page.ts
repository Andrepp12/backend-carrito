import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator // Validador personalizado
    });
  }

  // Validador para confirmar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { name, correo, password } = this.registerForm.value;

      this.http.post('http://127.0.0.1:8000/api/register', { name, correo, password }).subscribe({
        next: (response: any) => {
          console.log('Registro exitoso:', response);

          // Navegar al login después del registro
          alert('Registro exitoso. Por favor, inicia sesión.');
          this.navCtrl.navigateRoot('/login');
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          alert('Error en el registro. Por favor, verifica los datos.');
        },
      });
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }

}
