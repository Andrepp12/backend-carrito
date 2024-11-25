import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private userData: any = null; // Variable para almacenar los datos del usuario

  constructor() {}

  // Guardar los datos del usuario después del login
  setUserData(data: any): void {
    this.userData = data;
  }

  // Obtener los datos del usuario en cualquier parte de la aplicación
  getUserData(): any {
    return this.userData;
  }

  // Limpiar los datos al cerrar sesión
  clearUserData(): void {
    this.userData = null;
  }

  // Verificar si hay un usuario autenticado
  isLoggedIn(): boolean {
    return this.userData !== null;
  }
}
