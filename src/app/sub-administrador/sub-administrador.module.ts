import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubAdministradorPageRoutingModule } from './sub-administrador-routing.module';

import { SubAdministradorPage } from './sub-administrador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubAdministradorPageRoutingModule
  ],
  declarations: [SubAdministradorPage]
})
export class SubAdministradorPageModule {}
