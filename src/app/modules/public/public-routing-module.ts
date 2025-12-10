import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Notfound } from './pages/notfound/notfound';
import { Public } from './public';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: Public,
    children: [
      {
        path: 'home',
        component: Home,
        data: {
          title: 'Home',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/home',
            },
          ],
        },
      },
      {
        path: 'notfound',
        component: Notfound,

        data: {
          title: 'Not Found',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/home',
            },
            {
              label: 'Not Found',
              path: '/public/notfound',
            },
          ],
        },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
