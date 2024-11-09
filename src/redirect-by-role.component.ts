import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-redirect-by-role',
  template: ''
})
export class RedirectByRoleComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userRole = this.authService.getRole();
    switch (userRole) {
      case 'admin':
        this.router.navigate(['/administrador']);
        break;
      case 'Docente':
        this.router.navigate(['/teacher']);
        break;
      case 'sub-administrador':
        this.router.navigate(['/sub-administrador']);
        break;
      default:
        this.router.navigate(['/register']);
        break;
    }
  }
}
