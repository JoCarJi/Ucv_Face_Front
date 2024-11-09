import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  userData: any = {
    nombre: '',
    apell: '',
    usuario: '',
    password: '',
    telefono: '',
    dni: '',
    fecha_nac: '',
    rol: '',
    email: ''
  };
  fotoURL: string | ArrayBuffer | null = 'assets/image-icon.jpg';
  fotoBase64: string = ''; // Agregar una variable para la imagen en base64

  constructor(private userService: UserService, private toastCtrl: ToastController) {}

  ngOnInit() {}

  subirFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.fotoBase64 = reader.result.split(',')[1]; // Extraer solo la parte base64
          this.fotoURL = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async registrarUsuario() {
    if (!this.fotoBase64) {
      console.error('No se ha seleccionado ninguna foto');
      return;
    }
    if (!this.validarContrasena(this.userData.password)) {
      console.error('La contraseña debe ser de 8 dígitos y contener solo números');
      await this.mostrarMensaje('La contraseña debe ser de 8 dígitos y contener solo números');
      return;
    }
    const userDataWithImage = {
      ...this.userData,
      image: this.fotoBase64
    };

    this.userService.registerUser(userDataWithImage).subscribe(
      async (response: any) => {
        console.log('Usuario registrado exitosamente', response);
        this.limpiarCampos(); // Limpiar los campos después del registro exitoso
        await this.mostrarMensaje('Usuario registrado correctamente'); // Mostrar mensaje de éxito
      },
      async (error: any) => {
        console.error('Error registrando usuario', error);
        await this.mostrarMensaje('Error registrando usuario'); // Mostrar mensaje de error
      }
    );
  }

  limpiarCampos() {
    this.userData = {
      nombre: '',
      apell: '',
      usuario: '',
      password: '',
      telefono: '',
      dni: '',
      fecha_nac: '',
      rol: '',
      email: ''
    };
    this.fotoURL = 'assets/image-icon.jpg';
    this.fotoBase64 = '';
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  validarContrasena(password: string): boolean {
    const passwordPattern = /^[0-9]{8}$/;
    return passwordPattern.test(password);
  }
}
