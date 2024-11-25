import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.http.get('http://127.0.0.1:8000/api/me',{ withCredentials: true }).pipe(
      map(() => {
        // Si la solicitud tiene éxito, permite el acceso
        return true;
      }),
      catchError(() => {
        // Si hay un error, redirige al login
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
