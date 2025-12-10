import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing-module';
import { Home } from './pages/home/home';
import { Notfound } from './pages/notfound/notfound';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Public } from './public';

@NgModule({
  declarations: [
    Public,
    Home,
    Notfound,
    Header,
    Footer
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
