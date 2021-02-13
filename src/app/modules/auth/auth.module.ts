import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CommonNgModule } from '../../common-ng.module';
import { MaterialModule } from '../../material/material.module';

const components = [
  LoginComponent,
  SignupComponent
];

@NgModule({
  declarations: [... components],
  imports: [
    CommonNgModule,
    MaterialModule
  ],
  exports: [... components]
})
export class AuthModule { }
