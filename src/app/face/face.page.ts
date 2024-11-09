import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FaceService } from 'src/services/face.service';
import { ToastController, NavController } from '@ionic/angular';
import { AuthService } from 'src/services/auth.service';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from 'src/services/usuario.service';
import { UsuarioResponse } from 'src/interfaces/intUsuario/UsuarioResponse';

@Component({
  selector: 'app-face',
  templateUrl: './face.page.html',
  styleUrls: ['./face.page.scss'],
})
export class FacePage implements OnInit, AfterViewInit {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
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

  constructor(
    private faceService: FaceService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private usSrv: UsuarioService,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.startCamera();
  }

  async startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (this.video && this.video.nativeElement) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
        } else {
          console.error('Video element is not defined.');
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    } else {
      console.error('getUserMedia not supported in this browser.');
    }
  }

  async captureImage() {
    console.log('Capture Image called');
    const context = this.canvas.nativeElement.getContext('2d');
    if (context) {
      context.drawImage(this.video.nativeElement, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      const imageData = this.canvas.nativeElement.toDataURL('image/jpeg').split(',')[1]; // Capturar la imagen en base64
      const user = await firstValueFrom(this.usSrv.getAuthenticatedUsuario());
      this.Usuario = { ...user };
      this.loginWithFacialRecognition(this.Usuario.idUsuario,imageData);
    } else {
      console.error('Canvas context is not defined.');
    }
  }

  loginWithFacialRecognition(idUsuario: number | undefined ,imageData: string) {
    this.faceService.facialLogin(idUsuario, imageData).subscribe(
      async (response) => {
        console.log('Facial login response:', response); // Log para depurar
        if (response.success) {
          if (response.rol && response.user_id && response.user_data) {
            // Almacenar el token, rol y otros datos del usuario en AuthService
            //this.showToast(`Login successful! User ID: ${response.user_id}, Role: ${response.rol}`);
            this.redirectBasedOnRole(response.rol);
            await this.marcarEntrada(response.user_id);
          } else {
            this.showToast('Token, role, user ID, or user data missing in the response.');
            console.error('Token, role, user ID, or user data missing in the response:', response);
          }
        } else {
          this.showToast1(response.message);
        }
      },
      async (error) => {
        console.error('Error connecting to server:', error);
        this.showToast('Error connecting to server');
      }
    );
  }

  async marcarEntrada(idUsuario: number) {
    this.faceService.marcarEntrada(idUsuario).subscribe(
      async (response) => {
        if (response.success) {
          if (response.impuntual) {
            this.showToast1('Has llegado más de 15 minutos tarde. Entre a la hora correspondiente.');
          } else {
            this.showToast1('Entrada registrada con éxito');
          }
        } else {
          this.showToast1(response.message);
        }
      },
      async (error) => {
        this.showToast1('Error registrando entrada');
      }
    );
  }

  redirectBasedOnRole(rol: string) {
    switch (rol) {
      case 'admin':
        this.navCtrl.navigateForward('/administrador');
        break;
      case 'Docente':
        this.navCtrl.navigateForward('/teacher');
        break;
      case 'sub-administrador':
        this.navCtrl.navigateForward('/sub-administrador');
        break;
      default:
        this.showToast('USTED ES UN IMPOSTOR');
        break;
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async showToast1(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}