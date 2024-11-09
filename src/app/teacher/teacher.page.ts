// teacher.page.ts
import { Component, OnInit } from '@angular/core';
import { UsuarioResponse } from 'src/interfaces/intUsuario/UsuarioResponse';
import { UsuarioService } from 'src/services/usuario.service';
import { firstValueFrom } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.page.html',
  styleUrls: ['./teacher.page.scss'],
})
export class TeacherPage implements OnInit {
  breakActive: boolean = false;
  breakFinished: boolean = false;
  minutes: number = 60;
  seconds: number = 0;
  interval: any;
  breakDuration: number = 60 * 60;
  Usuario: UsuarioResponse = {
    apell: '',
    dni: '',
    email: '',
    fecha_nac: '',
    idUsuario: 0,
    nombre: '',
    rol: '',
    telefono: '',
    usuario: ''
  };
  rol: string | null = null;
  
  constructor(
    private usSrv: UsuarioService,
    private authService: AuthService,
    private navCtrl: NavController,
  ) { }

  async ngOnInit() {
    this.rol = this.authService.getRole();
    console.log('User role:', this.rol);  // Log para depurar
    try {
      const user = await firstValueFrom(this.usSrv.getAuthenticatedUsuario());
      this.Usuario = { ...user };
      console.log('User data:', this.Usuario); // Log user data for debugging
      this.checkNewDayAndResetState(); // Verificar si es un nuevo día y restablecer el estado
      this.loadState(); // Cargar el estado al iniciar
      if (this.breakActive) {
        this.resumeBreak();
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      if (error.status === 401) {
        console.log('Unauthorized, redirect to login.');
        this.navCtrl.navigateRoot('/register');
      }
    }
  }

  checkNewDayAndResetState() {
    const lastDate = localStorage.getItem('lastDate');
    const currentDate = new Date().toISOString().split('T')[0];

    if (lastDate !== currentDate) {
      this.breakActive = false;
      this.breakFinished = false;
      localStorage.removeItem('breakEndTime');
      this.saveState();
    }

    localStorage.setItem('lastDate', currentDate);
  }

  StartBreak() {
    if (this.Usuario && this.Usuario.idUsuario) {
      this.breakActive = true;
      this.saveState();

      // Llamada al servicio para iniciar el break
      this.usSrv.startBreak(this.Usuario.idUsuario).subscribe(response => {
        if (response.success) {
          this.startBreakTimer();
        } else {
          console.error('Error starting break:', response.message);
        }
      });
    } else {
      console.error('User ID is undefined.');
    }
  }

  startBreakTimer() {
    const endTime = Date.now() + this.breakDuration * 1000;
    localStorage.setItem('breakEndTime', endTime.toString());
    this.interval = setInterval(() => {
      this.updateTimer();
    }, 1000);
    this.updateTimer(); // Para actualizar inmediatamente
  }

  updateTimer() {
    const endTime = parseInt(localStorage.getItem('breakEndTime') || '0', 10);
    const remainingTime = Math.max(0, endTime - Date.now()) / 1000;

    this.minutes = Math.floor(remainingTime / 60);
    this.seconds = Math.floor(remainingTime % 60);

    if (remainingTime <= 0) {
      this.stopBreak();
    }
  }

  stopBreak() {
    if (this.Usuario && this.Usuario.idUsuario) {
      clearInterval(this.interval);
      this.breakActive = false;
      this.breakFinished = true;
      this.saveState();
      localStorage.removeItem('breakEndTime');

      // Llamada al servicio para finalizar el break
      this.usSrv.stopBreak(this.Usuario.idUsuario).subscribe(response => {
        if (!response.success) {
          console.error('Error stopping break:', response.message);
        }
      });
    } else {
      console.error('User ID is undefined.');
    }
  }

  resumeBreak() {
    const endTime = parseInt(localStorage.getItem('breakEndTime') || '0', 10);
    if (endTime > Date.now()) {
      this.interval = setInterval(() => {
        this.updateTimer();
      }, 1000);
      this.updateTimer(); // Para actualizar inmediatamente
    } else {
      this.stopBreak(); // Si el tiempo guardado ya pasó, detener el break
    }
  }

  saveState() {
    const state = {
      breakActive: this.breakActive,
      breakFinished: this.breakFinished
    };
    localStorage.setItem('breakState', JSON.stringify(state));
  }

  loadState() {
    const state = localStorage.getItem('breakState');
    if (state) {
      const parsedState = JSON.parse(state);
      this.breakActive = parsedState.breakActive;
      this.breakFinished = parsedState.breakFinished;
    }
  }
}