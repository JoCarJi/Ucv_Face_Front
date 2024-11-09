import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RedirectByRoleComponent } from 'src/redirect-by-role.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'redirect-by-role',
    pathMatch: 'full'
  },
  {
    path: 'redirect-by-role',
    canActivate: [AuthGuard],
    component: RedirectByRoleComponent// Un componente vacío para manejar la redirección por rol
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'exit',
    loadChildren: () => import('./exit/exit.module').then(m => m.ExitPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'administrador',
    loadChildren: () => import('./administrador/administrador.module').then(m => m.AdministradorPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'teacher',
    loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'Docente' }
  },
  {
    path: 'sub-administrador',
    loadChildren: () => import('./sub-administrador/sub-administrador.module').then(m => m.SubAdministradorPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'sub-administrador' }
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'face',
    loadChildren: () => import('./face/face.module').then(m => m.FacePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./asistencia/asistencia.module').then( m => m.AsistenciaPageModule),
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
