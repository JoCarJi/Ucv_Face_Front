import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/services/usuario.service';
import { UsuarioLogin } from 'src/interfaces/intUsuario/UsuarioLogin';
import { AuthService } from 'src/services/auth.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  formLoginUser: FormGroup;
  activeInput: 'usuario' | 'pass' = 'usuario';

  constructor(
    private userSvc: UsuarioService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    private authService: AuthService
  ) {
    this.formLoginUser = this.fb.group({
      usuario: new FormControl("", [Validators.required]),
      pass: new FormControl("", [Validators.required])
    });
  }

  ngOnInit() {}

  async loginUser() {
    const form = this.formLoginUser.value;

    if (this.formLoginUser.invalid) {
      const alert = await this.alertCtrl.create({
        header: 'Faltan datos',
        message: 'Existen campos sin completar',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const usuario: UsuarioLogin = {
      usuario: form.usuario,
      password: form.pass
    };

    this.userSvc.loginUsuario(usuario).pipe(
      tap(async resp => {
        console.log("RegisterPage loginUser response:", resp);
        if (resp.message === "Inicio de sesión exitoso" && resp.access_token && resp.rol && resp.usuario?.idUsuario) {
          this.authService.login(resp.access_token, resp.rol, resp.usuario.idUsuario, resp.usuario);
          const toast = await this.toastCtrl.create({
            message: 'Inicio de sesión exitoso',
            duration: 1500,
            position: 'bottom'
          });
          await toast.present();
          this.navCtrl.navigateForward('/face');
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: 'Usuario o contraseña incorrectos',
            buttons: ['Aceptar']
          });
          await alert.present();
        }
      }),
      catchError(async err => {
        console.error("Error:", err);
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'No se pudo conectar con el servidor',
          buttons: ['Aceptar']
        });
        await alert.present();
        return of(null);
      })
    ).subscribe();
  }

  onVirtualKeyPress(key: string) {
    const control = this.formLoginUser.get('pass');
    if (control) {
      if (key === 'Backspace') {
        control.setValue((control.value || '').slice(0, -1));
      } else if (key === 'ClearAll') {
        control.setValue('');
      } else {
        if ((control.value || '').length < 8) {
          control.setValue((control.value || '') + key);
        }
      }
    }
  }
}