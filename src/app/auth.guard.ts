import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.authService.isAuthenticated();
    const userRole = this.authService.getRole(); // Método para obtener el rol del usuario

    if (isAuthenticated) {
      const expectedRole = next.data['expectedRole']; // Acceso a expectedRole con notación de índice
      if (expectedRole && userRole !== expectedRole) {
        // Redirigir al usuario a la página correspondiente según su rol
        switch (userRole) {
          case 'admin':
            return this.router.createUrlTree(['/administrador']);
          case 'Docente':
            return this.router.createUrlTree(['/teacher']);
          case 'sub-administrador':
            return this.router.createUrlTree(['/sub-administrador']);
          // Agregar más casos según sea necesario
          default:
            return this.router.createUrlTree(['/user']);
        }
      }
      return true;
    } else {
      this.router.navigate(['/register']);
      return false;
    }
  }
}