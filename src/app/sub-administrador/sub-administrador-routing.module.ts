import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubAdministradorPage } from './sub-administrador.page';

const routes: Routes = [
  {
    path: '',
    component: SubAdministradorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubAdministradorPageRoutingModule {}
