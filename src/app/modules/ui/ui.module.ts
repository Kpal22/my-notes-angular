import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LogoutDialogComponent } from './components/header/logout-dialog/logout-dialog.component';
import { CommonNgModule } from '../../common-ng.module';
import { MaterialModule } from '../../material/material.module';
import { UiRoutingModule } from './ui-routing.module';
import { AuthModule } from '../auth/auth.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const components = [
  HeaderComponent,
  LogoutDialogComponent,
  FooterComponent,
  HomeComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonNgModule,
    MaterialModule,
    FontAwesomeModule,
    UiRoutingModule,
    AuthModule
  ],
  exports: [...components]
})
export class UiModule { }
